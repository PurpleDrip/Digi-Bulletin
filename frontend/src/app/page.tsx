"use client"

import * as React from "react";
import { AuthTabs } from "@/components/auth/auth-tabs";
import dynamic from 'next/dynamic';
import { Skeleton } from "@/components/ui/skeleton";
import AuthGate from "@/components/providers/AuthGate";

const HeroVisual = dynamic(() => 
  import('@/components/visuals/hero-visual').then(mod => mod.HeroVisual),
  { 
    loading: () => <Skeleton className="w-full h-full max-h-[calc(100vh-4rem)] rounded-lg" />,
    ssr: false 
  }
);


export default function AuthenticationPage() {
  return (
    <AuthGate>
    <div className="container mx-auto min-h-screen px-0 md:px-4">
      <div className="flex h-full min-h-screen flex-col md:flex-row">
        {/* Left Pane: Auth Forms */}
        <div className="flex w-full items-center justify-center p-4 md:w-1/2 md:p-8">
          <AuthTabs />
        </div>

        {/* Right Pane: Visuals */}
        <div className="hidden h-auto w-full items-center justify-center p-4 md:flex md:w-1/2 md:p-8 md:h-screen md:sticky md:top-0">
          <div className="w-full h-full max-h-[calc(100vh-4rem)]">
             <HeroVisual />
          </div>
        </div>
      </div>
    </div>
    </AuthGate>
  );
}