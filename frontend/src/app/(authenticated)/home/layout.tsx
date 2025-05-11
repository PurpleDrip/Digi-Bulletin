
import type { Metadata } from "next";
import { HomeSidebar } from "@/components/home/home-sidebar";
import { HomeHeader } from "@/components/home/home-header";

export const metadata: Metadata = {
  title: "DigiConnect Home",
  description: "Your central hub for DigiConnect.",
};

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-[calc(100vh-4rem)]"> {/* Subtract SiteHeader height */}
      <HomeSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <HomeHeader />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-muted/40">
          {children}
        </main>
      </div>
    </div>
  );
}
