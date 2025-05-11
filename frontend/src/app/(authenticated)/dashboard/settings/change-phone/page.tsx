"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Phone, KeyRound, Send, Loader2 } from "lucide-react";
import * as React from "react";

const changePhoneSchema = z.object({
  currentPhoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid current phone number format."),
  newPhoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid new phone number format."),
  otp: z.string().length(6, "OTP must be 6 digits."),
});

type ChangePhoneFormValues = z.infer<typeof changePhoneSchema>;

export default function ChangePhonePage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSendingOTP, setIsSendingOTP] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);


  const form = useForm<ChangePhoneFormValues>({
    resolver: zodResolver(changePhoneSchema),
    defaultValues: {
      currentPhoneNumber: "",
      newPhoneNumber: "",
      otp: "",
    },
  });
  
  const handleSendOTP = async () => {
    const newPhoneNumber = form.getValues("newPhoneNumber");
    const newPhoneFieldState = form.getFieldState("newPhoneNumber");

    if (!newPhoneNumber || newPhoneFieldState.invalid) {
      form.setError("newPhoneNumber", { type: "manual", message: "Please enter a valid new phone number to receive OTP."});
      return;
    }

    setIsSendingOTP(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    setIsSendingOTP(false);
    setOtpSent(true);
    toast({
      title: "OTP Sent",
      description: `An OTP has been sent to ${newPhoneNumber}. Check your messages.`,
    });
  };


  async function onSubmit(data: ChangePhoneFormValues) {
    if (!otpSent) {
        toast({
            variant: "destructive",
            title: "OTP Required",
            description: "Please send and verify OTP for the new phone number before submitting.",
        });
        return;
    }
    setIsSubmitting(true);
    console.log("Changing phone number with data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    toast({
      title: "Phone Number Change Attempt",
      description: "Phone number updated successfully! (Simulated)",
    });
    form.reset();
    setOtpSent(false);
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Change Registered Phone Number</CardTitle>
          <CardDescription>
            Update the phone number associated with your administrator account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Phone Number</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input type="tel" placeholder="Your current phone number" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPhoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Phone Number</FormLabel>
                    <FormControl>
                     <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input type="tel" placeholder="Enter new phone number" {...field} className="pl-10" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!otpSent && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleSendOTP} 
                  disabled={isSendingOTP || !form.watch("newPhoneNumber") || !!form.getFieldState("newPhoneNumber").error}
                >
                  {isSendingOTP ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="mr-2 h-4 w-4" />
                  )}
                  {isSendingOTP ? "Sending OTP..." : "Send OTP to New Number"}
                </Button>
              )}

              {otpSent && (
                 <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>OTP (One-Time Password)</FormLabel>
                        <FormControl>
                        <div className="relative">
                            <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input type="text" placeholder="Enter 6-digit OTP" {...field} maxLength={6} className="pl-10"/>
                        </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
              )}


              <Button type="submit" className="w-full" disabled={isSubmitting || isSendingOTP}>
                 {isSubmitting || isSendingOTP ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Updating Phone Number..." : "Update Phone Number"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
