
import { AnnouncementsDiscussion } from "@/components/home/announcements-discussion";
import { RecentActivity } from "@/components/home/recent-activity";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <AnnouncementsDiscussion />
      <RecentActivity />
    </div>
  );
}
