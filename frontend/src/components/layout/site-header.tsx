
import Link from "next/link"
import { ThemeToggleButton } from "@/components/theme/theme-toggle-button"
import { Button } from "@/components/ui/button"
import { LayoutDashboard } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            {/* MSRIT Logo SVG */}
            <svg 
              width="36" 
              height="36" 
              viewBox="0 0 270 270" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-primary"
              data-ai-hint="university logo"
            >
              <path d="M135 270C209.555 270 270 209.555 270 135C270 60.4454 209.555 0 135 0C60.4454 0 0 60.4454 0 135C0 209.555 60.4454 270 135 270Z" fill="currentColor"/>
              <path d="M134.999 40.0741L43.7139 101.158V223.325L134.999 162.242L226.285 223.325V101.158L134.999 40.0741Z" fill="hsl(var(--background))"/>
              <path d="M135 40L43.75 101.25V223.75L135 162.5L226.25 223.75V101.25L135 40Z" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2"/>
              <path d="M135 94.5V137" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2"/>
              <path d="M98.5 115.5L135 137L171.5 115.5" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2"/>
            </svg>
            <span className="inline-block font-bold">DigiConnect</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center space-x-1">
            <ThemeToggleButton />
            <Link href="/home">
              <Button variant="ghost" size="sm">Home</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" title="Admin Dashboard">
                <LayoutDashboard className="h-5 w-5" />
                <span className="sr-only">Admin Dashboard</span>
                </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
