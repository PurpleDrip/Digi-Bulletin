import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, UserX, Eye } from "lucide-react";

// Mock data - replace with actual data fetching
const reportedAccounts = [
  { id: "usr_001", name: "Eve Malory", usn: "1MS19IS050", reason: "Spamming content", reportedBy: "Admin", dateReported: "2024-07-25", status: "Pending Review" },
  { id: "usr_002", name: "John Doe", usn: "FAC102", reason: "Inappropriate profile picture", reportedBy: "UserX23", dateReported: "2024-07-24", status: "Resolved" },
];

export default function ReportedAccountsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reported Accounts</CardTitle>
          <CardDescription>
            Manage accounts that have been reported for violating community guidelines.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reportedAccounts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>USN/ID</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportedAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{account.usn}</TableCell>
                  <TableCell className="max-w-xs truncate">{account.reason}</TableCell>
                  <TableCell>{account.reportedBy}</TableCell>
                  <TableCell>{account.dateReported}</TableCell>
                  <TableCell>
                    <Badge variant={account.status === "Pending Review" ? "destructive" : "outline"}>
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" title="View Details">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {account.status === "Pending Review" && (
                      <>
                        <Button variant="ghost" size="icon" title="Mark as Resolved" className="text-green-500 hover:text-green-600">
                          <ShieldCheck className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Suspend Account" className="text-red-500 hover:text-red-600">
                          <UserX className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          ) : (
             <p className="text-muted-foreground text-center py-8">No accounts have been reported recently.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
