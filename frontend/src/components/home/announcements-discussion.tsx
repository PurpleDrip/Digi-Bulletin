
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

export function AnnouncementsDiscussion() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Newspaper className="h-6 w-6 text-primary" />
        <div>
            <CardTitle>Announcements Discussion</CardTitle>
            <CardDescription>Current messages and discussions in this channel. (Mock data)</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <p>Welcome to the channel! Here's a recap of recent discussions:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Upcoming mid-term exams: Study material for CS101 has been shared in the files section. Professor Smith mentioned focusing on chapters 3-5.</li>
          <li>College Fest 'Catalyst 2024': Volunteer sign-ups are now open. The first planning meeting is scheduled for next Tuesday at 3 PM in the auditorium. We need volunteers for logistics, stage management, and promotions.</li>
          <li>Guest Lecture on AI Ethics: Scheduled for Friday, 10 AM. Dr. Emily Carter will be speaking. Attendance is highly recommended for all CS and ECE students.</li>
          <li>New Library Timings: The library will now be open until 10 PM on weekdays and 6 PM on Saturdays. Sunday remains closed.</li>
          <li>Sports Update: The inter-departmental cricket tournament finals will be held this Saturday. CS Warriors vs. ME Titans. Come support your teams!</li>
          <li>Placement Drive: Infosys will be conducting a campus recruitment drive for final year students next month. Details will be shared soon.</li>
          <li>Feedback on Canteen Food: Several students have requested more vegetarian options. The student council is discussing this with the canteen management.</li>
        </ul>
        <p className="pt-2 font-medium text-foreground">
            Please keep discussions respectful and relevant to the channel's purpose.
        </p>
        <p className="text-xs">
            Remember, official announcements are critical. Please check regularly.
        </p>
      </CardContent>
    </Card>
  );
}
