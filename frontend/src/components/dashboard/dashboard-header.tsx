"use client";

import { ThemeToggleButton } from "@/components/theme/theme-toggle-button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle } from "lucide-react";
import Link from "next/link";
import { DashboardSidebarNav } from "./dashboard-sidebar-nav"; // Assuming this will be created

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       {/* Mobile Menu Trigger - re-uses sidebar nav logic if needed */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs bg-sidebar text-sidebar-foreground p-0">
           <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 bg-sidebar">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold text-sidebar-primary-foreground">
                 <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 270 270" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-sidebar-primary"
                >
                  <path d="M135 270C209.555 270 270 209.555 270 135C270 60.4454 209.555 0 135 0C60.4454 0 0 60.4454 0 135C0 209.555 60.4454 270 135 270Z" fill="currentColor"/>
                  <path d="M134.999 40.0741L43.7139 101.158V223.325L134.999 162.242L226.285 223.325V101.158L134.999 40.0741Z" fill="hsl(var(--sidebar-background))"/>
                </svg>
              <span className="">DigiConnect</span>
            </Link>
          </div>
          <nav className="grid gap-2 text-lg font-medium p-2">
            <DashboardSidebarNav isMobile={true} />
          </nav>
        </SheetContent>
      </Sheet>
      
      {/* Placeholder for Breadcrumbs or Search */}
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
        /> */}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggleButton />
        <Button variant="outline" size="icon" className="rounded-full">
          <UserCircle className="h-5 w-5" />
          <span className="sr-only">User menu</span>
        </Button>
      </div>
    </header>
  );
}
