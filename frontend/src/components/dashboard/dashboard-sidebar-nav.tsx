"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  UsersRound,
  ShieldAlert,
  LineChart,
  Settings,
  KeyRound,
  Phone,
  ListChecks
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface DashboardSidebarNavProps {
  isMobile?: boolean;
  className?: string;
}


export function DashboardSidebarNav({ isMobile = false, className }: DashboardSidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/pending-accounts", label: "Pending Accounts", icon: ListChecks },
    { href: "/dashboard/reported-accounts", label: "Reported Accounts", icon: ShieldAlert },
    { href: "/dashboard/analytics", label: "Analytics", icon: LineChart },
    {
      label: "Settings",
      icon: Settings,
      isAccordion: true,
      subItems: [
        { href: "/dashboard/settings/change-password", label: "Change Password", icon: KeyRound },
        { href: "/dashboard/settings/change-phone", label: "Change Phone Number", icon: Phone },
      ],
    },
  ];

  const linkClass = (href: string, isSubItem = false) => 
    cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:text-sidebar-primary hover:bg-sidebar-accent",
      pathname === href ? "bg-sidebar-accent text-sidebar-primary font-semibold" : "text-sidebar-foreground",
      isMobile && "text-base",
      isSubItem && "ml-4" // Indent sub-items
    );
  
  const iconClass = (href: string) => 
    cn("h-4 w-4", pathname === href ? "text-sidebar-primary" : "text-sidebar-foreground/80");


  return (
    <div className={cn("flex flex-col", className)}>
      {navItems.map((item) =>
        item.isAccordion && item.subItems ? (
          <Accordion key={item.label} type="single" collapsible className="w-full">
            <AccordionItem value={item.label} className="border-b-0">
              <AccordionTrigger className={cn(
                linkClass("#"), // Use a dummy href for styling parent
                "hover:no-underline justify-between"
              )}>
                <div className="flex items-center gap-3">
                  <item.icon className={iconClass("#")} />
                  {item.label}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pl-4 pt-1 pb-0"> {/* Adjusted padding */}
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={linkClass(subItem.href, true) + " my-1"} // Added margin for sub-items
                  >
                    <subItem.icon className={iconClass(subItem.href)} />
                    {subItem.label}
                  </Link>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ) : (
          <Link key={item.href} href={item.href!} className={linkClass(item.href!)}>
            <item.icon className={iconClass(item.href!)} />
            {item.label}
          </Link>
        )
      )}
    </div>
  );
}
