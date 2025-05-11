import Link from "next/link";
import { DashboardSidebarNav } from "./dashboard-sidebar-nav";

export function DashboardSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r bg-sidebar text-sidebar-foreground sm:flex">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-primary-foreground">
           <svg 
              width="24" 
              height="24" 
              viewBox="0 0 270 270" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-sidebar-primary"
              data-ai-hint="university logo"
            >
              <path d="M135 270C209.555 270 270 209.555 270 135C270 60.4454 209.555 0 135 0C60.4454 0 0 60.4454 0 135C0 209.555 60.4454 270 135 270Z" fill="currentColor"/>
              <path d="M134.999 40.0741L43.7139 101.158V223.325L134.999 162.242L226.285 223.325V101.158L134.999 40.0741Z" fill="hsl(var(--sidebar-background))"/> {/* Use sidebar-background for inner part */}
            </svg>
          <span className="">DigiConnect Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          <DashboardSidebarNav />
        </nav>
      </div>
    </aside>
  );
}
