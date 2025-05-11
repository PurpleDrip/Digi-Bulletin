import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { KeyRound, Phone, Bell, Palette } from "lucide-react";

export default function SettingsPage() {
  const settingsOptions = [
    {
      title: "Change Password",
      description: "Update your account password for better security.",
      href: "/dashboard/settings/change-password",
      icon: KeyRound,
    },
    {
      title: "Change Phone Number",
      description: "Modify the phone number associated with your account.",
      href: "/dashboard/settings/change-phone",
      icon: Phone,
    },
    {
      title: "Notification Preferences",
      description: "Manage how you receive notifications from the platform.",
      href: "#", // Placeholder
      icon: Bell,
    },
     {
      title: "Appearance",
      description: "Customize the look and feel of your dashboard (theme handled globally).",
      href: "#", // Placeholder
      icon: Palette,
    },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>
            Manage your administrator account settings and preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          {settingsOptions.map((option) => (
            <Card key={option.title}>
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <div className="shrink-0">
                  <option.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{option.title}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={option.href} passHref legacyBehavior>
                  <Button variant="outline" className="w-full" disabled={option.href === "#"}>
                    {option.href === "#" ? "Coming Soon" : `Go to ${option.title}`}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
