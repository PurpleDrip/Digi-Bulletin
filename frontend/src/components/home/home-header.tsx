
"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { HomeSidebar } from "./home-sidebar"; // For mobile drawer

// This should ideally come from context or props
const currentChannelName = "Announcements"; 

export function HomeHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-72">
          {/* We need to render the HomeSidebar inside the sheet for mobile */}
          <HomeSidebar />
        </SheetContent>
      </Sheet>
      
      <h1 className="text-xl font-semibold">{currentChannelName}</h1>

      <div className="ml-auto">
        <Button variant="outline">
          <BrainCircuit className="mr-2 h-4 w-4" />
          AI Summary
        </Button>
      </div>
    </header>
  );
}
