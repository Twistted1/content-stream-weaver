import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AudienceChart } from "@/components/dashboard/AudienceChart";
import { PlatformPerformance } from "@/components/dashboard/PlatformPerformance";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { QuickNotes } from "@/components/dashboard/QuickNotes";
import { FileText, TrendingUp, Calendar } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { LoadingState } from "@/components/ui/LoadingState";

const Index = () => {
  const stats = useDashboardStats();

  if (stats.isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading dashboard..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-black tracking-tighter text-foreground">Overview</h1>
        </div>

        {/* Stats Cards - Real Data */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Posts"
            value={stats.totalPosts.toLocaleString()}
            change={`${stats.publishedPosts} published`}
            changeType="neutral"
            icon={FileText}
            iconColor="bg-primary/20"
          />
          <StatsCard
            title="Scheduled"
            value={stats.scheduledPosts.toLocaleString()}
            change="Upcoming posts"
            changeType="neutral"
            icon={Calendar}
            iconColor="bg-[hsl(var(--warning))]/20"
          />
          <StatsCard
            title="Drafts"
            value={stats.draftPosts.toLocaleString()}
            change="In progress"
            changeType="neutral"
            icon={TrendingUp}
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
