import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AudienceChart } from "@/components/dashboard/AudienceChart";
import { PlatformPerformance } from "@/components/dashboard/PlatformPerformance";
import { RecentPosts } from "@/components/dashboard/RecentPosts";
import { QuickNotes } from "@/components/dashboard/QuickNotes";
import { FileText, TrendingUp, Calendar, Sparkles, Target, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { LoadingState } from "@/components/ui/LoadingState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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
      <div className="space-y-8 animate-in fade-in duration-700">
        {/* Header with AI Context */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-primary">
              <Sparkles className="h-6 w-6 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Autonomous Mode Active</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter text-foreground uppercase italic px-4 bg-gradient-to-r from-primary/20 to-transparent border-l-4 border-primary">Overview</h1>
            <p className="text-muted-foreground mt-2 ml-4">System pulse: All platforms operational & synced.</p>
          </div>
          <div className="flex items-center gap-3">
             <Button variant="outline" className="rounded-xl border-border bg-card/50 px-6 font-bold uppercase text-[10px] tracking-widest gap-2">
               <ShieldCheck className="h-4 w-4 text-emerald-500" />
               View Audit
             </Button>
             <Button className="rounded-xl bg-primary hover:opacity-90 text-white font-bold uppercase text-[10px] tracking-widest px-8 shadow-lg shadow-primary/20 gap-2">
               <Zap className="h-4 w-4" />
               Quick Action
             </Button>
          </div>
        </div>

        {/* AI Strategic Overview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 bg-card border border-border rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                <Target className="h-48 w-48" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1 space-y-6">
                <div>
                   <Badge variant="outline" className="mb-4 bg-primary/10 border-primary/20 text-primary text-[10px] font-black tracking-widest px-3">CURRENT STRATEGY</Badge>
                   <h2 className="text-xl font-black tracking-tighter text-foreground mb-2 italic uppercase">Expand TikTok Footprint</h2>
                   <p className="text-muted-foreground max-w-xl">Based on last week's performance, TikTok engagement is 4.2x higher than other channels. We've queued 3 educational clips to capitalize on this trend.</p>
                </div>
                
                <div className="flex items-center gap-8">
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Confidence</span>
                      <div className="flex items-center gap-2">
                         <span className="text-xl font-bold text-foreground">94%</span>
                         <Progress value={94} className="w-20 h-1.5 bg-muted" />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Expected ROI</span>
                      <div className="flex items-center gap-2 text-emerald-500">
                         <TrendingUp className="h-4 w-4" />
                         <span className="text-xl font-bold">+12.4%</span>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="w-full md:w-64 space-y-4 bg-background/50 backdrop-blur-md rounded-2xl p-6 border border-border">
                 <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Month Goal</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">72% Met</span>
                 </div>
                 <h4 className="font-bold text-sm">Target: 50,000 Views</h4>
                 <Progress value={72} className="h-2 bg-muted transition-all duration-1000" />
                 <Button variant="link" className="p-0 h-auto text-[10px] font-bold uppercase tracking-widest text-primary gap-1 group">
                    Adjust Targets
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                 </Button>
              </div>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-[2rem] p-8 flex flex-col justify-between group hover:bg-primary/10 transition-colors cursor-pointer overflow-hidden relative">
             <div className="absolute top-[-20px] right-[-20px] opacity-[0.05] group-hover:rotate-12 transition-transform duration-500">
                <Sparkles className="h-32 w-32 text-primary" />
             </div>
             <div>
                <Badge className="bg-primary text-white text-[9px] font-black tracking-widest px-2 mb-4">NEW INSIGHT</Badge>
                <h3 className="text-lg font-black tracking-tighter italic uppercase text-foreground leading-tight">Video duration sweet spot found.</h3>
                <p className="text-xs text-muted-foreground mt-4 leading-relaxed">Posts between 45-60s are seeing 28% higher completion rates in your niche.</p>
             </div>
             <Button variant="ghost" className="p-0 h-auto w-fit text-[10px] font-black uppercase tracking-widest text-primary mt-6 group">
                Apply to scripts
                <Zap className="ml-1 h-3 w-3 group-hover:scale-125 transition-transform" />
             </Button>
          </div>
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
            change="Upcoming events"
            changeType="neutral"
            icon={Calendar}
            iconColor="bg-amber-500/20"
          />
          <StatsCard
            title="Drafts"
            value={stats.draftPosts.toLocaleString()}
            change="Work in progress"
            changeType="neutral"
            icon={TrendingUp}
            iconColor="bg-emerald-500/20"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
          <RecentPosts />
          <QuickNotes />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
