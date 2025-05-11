
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Recent Activity (Mock)
        </CardTitle>
        <CardDescription>A quick glance at what's been happening.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <div>
              <span className="font-medium">New post</span> in <span className="font-semibold text-primary">#campus-news</span> by Admin: "Mid-sem break dates announced."
              <p className="text-xs text-muted-foreground">2 hours ago</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <div>
              <span className="font-medium">Event created</span>: "Guest Lecture on Quantum Computing" by <span className="font-semibold text-primary">Dr. Anya Sharma (Physics Dept)</span>.
               <p className="text-xs text-muted-foreground">5 hours ago</p>
            </div>
          </li>
           <li className="flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
            <div>
              <span className="font-medium">John Doe</span> commented on your post in <span className="font-semibold text-primary">#off-topic</span>.
               <p className="text-xs text-muted-foreground">1 day ago</p>
            </div>
          </li>
        </ul>
        {/* Placeholder for more detailed activity feed */}
        <p className="mt-4 text-center text-xs text-muted-foreground">
          More activity will be shown here.
        </p>
      </CardContent>
    </Card>
  );
}
