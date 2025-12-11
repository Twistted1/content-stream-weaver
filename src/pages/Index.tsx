import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AudienceChart } from "@/components/dashboard/AudienceChart";
import { PlatformPerformance } from "@/components/dashboard/PlatformPerformance";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { QuickNotes } from "@/components/dashboard/QuickNotes";
import { Users, TrendingUp, UserPlus } from "lucide-react";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Reach"
            value="78,291"
            change="+12.5% this month"
            changeType="positive"
            icon={Users}
            iconColor="bg-primary/20"
          />
          <StatsCard
            title="Engagement Rate"
            value="4.72%"
            change="-0.2% this month"
            changeType="negative"
            icon={TrendingUp}
            iconColor="bg-[hsl(var(--warning))]/20"
          />
          <StatsCard
            title="New Followers"
            value="1,204"
            change="+21% this month"
            changeType="positive"
            icon={UserPlus}
            iconColor="bg-[hsl(var(--success))]/20"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AudienceChart />
          </div>
          <PlatformPerformance />
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentPosts />
          <QuickNotes />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
