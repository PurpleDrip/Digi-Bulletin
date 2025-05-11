"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RegistrationForm } from "./registration-form";
import { LoginForm } from "./login-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, UserPlus } from "lucide-react";

export function AuthTabs() {
  return (
    <Tabs defaultValue="register" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="register">
          <UserPlus className="mr-2 h-4 w-4" /> Register
        </TabsTrigger>
        <TabsTrigger value="login">
          <Lock className="mr-2 h-4 w-4" /> Login
        </TabsTrigger>
      </TabsList>
      <TabsContent value="register">
        <Card className="border-0 shadow-none md:border md:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Create an Account</CardTitle>
            <CardDescription>
              Enter your details below to register.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegistrationForm />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="login">
        <Card className="border-0 shadow-none md:border md:shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
