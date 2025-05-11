"use client"; // Required for Recharts and React.memo on client components

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart as LucideLineChart } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend as RechartsLegend, ResponsiveContainer, LineChart, BarChart as RechartsBarChart } from 'recharts';

// Mock Data (remains the same)
const userActivityData = [
  { date: "2024-07-01", activeUsers: 200, newSignups: 15 },
  { date: "2024-07-02", activeUsers: 220, newSignups: 20 },
  { date: "2024-07-03", activeUsers: 180, newSignups: 10 },
  { date: "2024-07-04", activeUsers: 250, newSignups: 25 },
  { date: "2024-07-05", activeUsers: 230, newSignups: 18 },
  { date: "2024-07-06", activeUsers: 270, newSignups: 30 },
  { date: "2024-07-07", activeUsers: 300, newSignups: 22 },
];

const contentEngagementData = [
  { type: "Posts", count: 1200 },
  { type: "Comments", count: 3500 },
  { type: "Likes", count: 15000 },
  { type: "Events", count: 50 },
  { type: "Groups", count: 120 },
];

const chartConfig = {
  activeUsers: { label: "Active Users", color: "hsl(var(--chart-1))" },
  newSignups: { label: "New Signups", color: "hsl(var(--chart-2))" },
  count: { label: "Count", color: "hsl(var(--chart-3))" }
} satisfies Record<string, { label: string; color: string; icon?: React.ComponentType }>;

// Memoized Card Component for User Activity Chart
const UserActivityChartCard = React.memo(function UserActivityChartCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">User Activity</CardTitle>
        <LucideLineChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userActivityData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
              <YAxis />
              <RechartsTooltip content={<ChartTooltipContent indicator="line" />} />
              <RechartsLegend content={<ChartLegendContent />} />
              <Line type="monotone" dataKey="activeUsers" stroke={chartConfig.activeUsers.color} strokeWidth={2} dot={false} name="Active Users" />
              <Line type="monotone" dataKey="newSignups" stroke={chartConfig.newSignups.color} strokeWidth={2} dot={false} name="New Signups" />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
UserActivityChartCard.displayName = "UserActivityChartCard";

// Memoized Card Component for Content Engagement Chart
const ContentEngagementChartCard = React.memo(function ContentEngagementChartCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Content Engagement</CardTitle>
        <BarChart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
         <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={contentEngagementData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis dataKey="type" type="category" width={80} />
               <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} />
              <RechartsLegend content={<ChartLegendContent />} />
              <Bar dataKey="count" fill={chartConfig.count.color} radius={[0, 4, 4, 0]} name="Count" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
});
ContentEngagementChartCard.displayName = "ContentEngagementChartCard";


export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Platform Analytics</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <UserActivityChartCard />
        <ContentEngagementChartCard />
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>More Analytics</CardTitle>
            <CardDescription>Further detailed analytics will be shown here.</CardDescription>
        </CardHeader>
        <CardContent>
            <p className="text-muted-foreground">User demographics, feature usage, etc.</p>
        </CardContent>
      </Card>
    </div>
  );
}