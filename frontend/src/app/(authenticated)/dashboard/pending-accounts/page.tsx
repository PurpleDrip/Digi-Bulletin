"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPendingAccounts, approveAccount, rejectAccount, type PendingAccount } from "@/services/admin-service";
import { USER_TYPES_CONFIG } from "@/lib/constants";
import type { UserTypeValue } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

export default function PendingAccountsPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: pendingAccounts, isLoading, isError, error } = useQuery<PendingAccount[], Error>({
    queryKey: ["pendingAccounts"],
    queryFn: getPendingAccounts,
  });

  const mutationOptions = {
    onSuccess: (data: { success: boolean; message: string}, variables: string) => {
      toast({
        title: data.success ? "Success" : "Error",
        description: data.message,
        variant: data.success ? "default" : "destructive",
      });
      if (data.success) {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ["pendingAccounts"] });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Operation Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  };

  const approveMutation = useMutation({
    mutationFn: approveAccount,
    ...mutationOptions,
  });

  const rejectMutation = useMutation({
    mutationFn: rejectAccount,
    ...mutationOptions,
  });

  const handleApprove = (accountId: string) => {
    approveMutation.mutate(accountId);
  };

  const handleReject = (accountId: string) => {
    rejectMutation.mutate(accountId);
  };

  const getUserTypeLabel = (userTypeKey: string) => {
    const key = userTypeKey as UserTypeValue;
    return USER_TYPES_CONFIG[key]?.label || userTypeKey.replace(/_/g, ' ');
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Accounts Waiting for Confirmation</CardTitle>
            <CardDescription>Loading pending accounts...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Fetching data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Accounts</CardTitle>
            <CardDescription>There was an issue fetching pending accounts.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10 text-destructive">
            <AlertTriangle className="h-10 w-10 mb-2" />
            <p className="font-semibold">Failed to load data.</p>
            <p className="text-sm">{error?.message || "Please try again later."}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Accounts Waiting for Confirmation</CardTitle>
          <CardDescription>
            Review and approve or reject new account registrations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!pendingAccounts || pendingAccounts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No accounts are currently waiting for confirmation.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>USN/ID</TableHead>
                  <TableHead>User Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingAccounts.map((account) => (
                  <TableRow key={account.id}>
                    <TableCell className="font-medium">{account.name}</TableCell>
                    <TableCell>{account.usn}</TableCell>
                    <TableCell><Badge variant="secondary">{getUserTypeLabel(account.userType)}</Badge></TableCell>
                    <TableCell>{account.department || "N/A"}</TableCell>
                    <TableCell>{new Date(account.dateSubmitted).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-green-500 hover:text-green-600"
                        onClick={() => handleApprove(account.id)}
                        disabled={approveMutation.isPending && approveMutation.variables === account.id}
                      >
                        {approveMutation.isPending && approveMutation.variables === account.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        <span className="sr-only">Approve</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleReject(account.id)}
                        disabled={rejectMutation.isPending && rejectMutation.variables === account.id}
                      >
                         {rejectMutation.isPending && rejectMutation.variables === account.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        <span className="sr-only">Reject</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}