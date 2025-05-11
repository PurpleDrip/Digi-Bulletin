
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  Search,
  LayoutGrid,
  Newspaper,
  Briefcase,
  GraduationCap,
  MessageSquare,
  Building2,
  Users,
  UserCog,
  ChevronDown,
  ChevronRight,
  Settings,
  LogOut,
  UserCircle,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { ThemeToggleButton } from "@/components/theme/theme-toggle-button";

// Mock data - replace with actual data later
const userData = {
  name: "Suresh Kumar",
  role: "Student - CS 4th Year",
  avatarUrl: "https://picsum.photos/id/237/100/100", // Replace with actual user avatar
  department: "Computer Science",
};

const generalChannels = [
  { name: "Announcements", icon: Newspaper, href: "/home/announcements" },
  { name: "Campus News", icon: Bell, href: "/home/campus-news" }, // Changed icon
  { name: "Internship Opportunities", icon: Briefcase, href: "/home/internships" },
  { name: "Scholarship Information", icon: GraduationCap, href: "/home/scholarships" },
  { name: "Off-Topic Discussion", icon: MessageSquare, href: "/home/off-topic" },
];

const departmentChannels = [
  {
    name: "Computer Science",
    icon: LayoutGrid, // Generic department icon
    subChannels: [
      { name: "Admin", icon: UserCog, href: "/home/cs/admin" },
      { name: "Faculties", icon: Users, href: "/home/cs/faculties" },
      {
        name: "Students",
        icon: Users,
        hrefPrefix: "/home/cs/students",
        years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      },
    ],
  },
  {
    name: "Mechanical",
    icon: Settings, // Generic department icon
    subChannels: [
      { name: "Admin", icon: UserCog, href: "/home/mech/admin" },
      { name: "Faculties", icon: Users, href: "/home/mech/faculties" },
      {
        name: "Students",
        icon: Users,
        hrefPrefix: "/home/mech/students",
        years: ["1st Year", "2nd Year", "3rd Year", "4th Year"],
      },
    ],
  },
];

export function HomeSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/"); // Basic active check

  return (
    <aside className="sticky top-0 flex h-full w-72 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/home" className="flex items-center gap-2 font-semibold text-primary">
            <svg
              width="24"
              height="24"
              viewBox="0 0 270 270"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7"
              data-ai-hint="university logo"
            >
              <path d="M135 270C209.555 270 270 209.555 270 135C270 60.4454 209.555 0 135 0C60.4454 0 0 60.4454 0 135C0 209.555 60.4454 270 135 270Z" fill="currentColor"/>
              <path d="M134.999 40.0741L43.7139 101.158V223.325L134.999 162.242L226.285 223.325V101.158L134.999 40.0741Z" fill="hsl(var(--card))"/>
               <path d="M135 40L43.75 101.25V223.75L135 162.5L226.25 223.75V101.25L135 40Z" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeWidth="2"/>
            </svg>
          <span className="text-lg">DigiConnect</span>
        </Link>
        <div className="ml-auto">
            <ThemeToggleButton />
        </div>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Search channels..." className="w-full rounded-md bg-background pl-10 h-9" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <nav className="grid items-start px-4 text-sm font-medium">
          <div className="mb-2">
            <h3 className="px-0 py-1 text-xs font-semibold uppercase text-muted-foreground/80">
              General
            </h3>
            {generalChannels.map((channel) => (
              <Link
                key={channel.name}
                href={channel.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive(channel.href) ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-card-foreground"
                )}
              >
                <channel.icon className="h-4 w-4" />
                {channel.name}
              </Link>
            ))}
          </div>

          <div>
            <h3 className="px-0 py-1 text-xs font-semibold uppercase text-muted-foreground/80">
              Department
            </h3>
            <Accordion type="multiple" className="w-full">
              {departmentChannels.map((dept) => (
                <AccordionItem key={dept.name} value={dept.name} className="border-b-0">
                  <AccordionTrigger className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent hover:text-accent-foreground hover:no-underline",
                     // Check if any subchannel is active to highlight the parent department
                    dept.subChannels.some(sc => isActive(sc.href || `${sc.hrefPrefix}/${(sc.years?.[0] || '').toLowerCase().replace(' ', '-')}`)) ? "bg-primary/10 text-primary" : "text-card-foreground"
                  )}>
                    <div className="flex items-center gap-3">
                      <dept.icon className="h-4 w-4" />
                      {dept.name}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    {dept.subChannels.map((subChannel) =>
                      subChannel.years ? ( // If it has years, it's a nested accordion for students
                        <Accordion key={subChannel.name} type="single" collapsible className="w-full">
                          <AccordionItem value={subChannel.name} className="border-b-0">
                            <AccordionTrigger className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-accent/50 hover:text-accent-foreground hover:no-underline",
                                subChannel.years.some(year => isActive(`${subChannel.hrefPrefix}/${year.toLowerCase().replace(' ', '-')}`)) ? "text-primary" : "text-card-foreground"
                            )}>
                               <div className="flex items-center gap-3">
                                <subChannel.icon className="h-4 w-4" />
                                {subChannel.name}
                               </div>
                            </AccordionTrigger>
                            <AccordionContent className="pl-4">
                              {subChannel.years.map((year) => (
                                <Link
                                  key={year}
                                  href={`${subChannel.hrefPrefix}/${year.toLowerCase().replace(' ', '-')}`}
                                  className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-accent/50 hover:text-accent-foreground",
                                    isActive(`${subChannel.hrefPrefix}/${year.toLowerCase().replace(' ', '-')}`) ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-card-foreground"
                                  )}
                                >
                                  {/* Consider adding year-specific icons if desired */}
                                  <Users className="h-3 w-3" /> 
                                  {year}
                                </Link>
                              ))}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ) : (
                        <Link
                          key={subChannel.name}
                          href={subChannel.href!}
                          className={cn(
                            "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-all hover:bg-accent/50 hover:text-accent-foreground",
                             isActive(subChannel.href!) ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "text-card-foreground"
                          )}
                        >
                          <subChannel.icon className="h-4 w-4" />
                          {subChannel.name}
                        </Link>
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </nav>
      </ScrollArea>

      <div className="mt-auto border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={userData.avatarUrl} alt={userData.name} data-ai-hint="user profile" />
            <AvatarFallback>{userData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{userData.name}</p>
            <p className="text-xs text-muted-foreground">{userData.role}</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
