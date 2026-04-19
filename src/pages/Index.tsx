import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { usePosts } from "@/hooks/usePosts";
import { useAuth } from "@/hooks/useAuth";
import { useAutomations } from "@/hooks/useAutomations";
import { useNotes } from "@/hooks/useNotes";
import { format, subDays, isToday, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import {
  Plus, Eye, Zap, TrendingUp, TrendingDown, FileText, Calendar, Clock,
  Youtube, Instagram, Twitter, Linkedin, Facebook, Globe, Music2,
  CheckCircle2, AlertCircle, Play, BarChart3, Target, ChevronLeft, ChevronRight,
  ArrowRight, Activity, Sparkles, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";

// ── Platform config ──────────────────────────────────────────────────────────────
const PLATFORM_CONFIG: Record<string, { icon: any; color: string; barColor: string; label: string }> = {
  youtube:   { icon: Youtube,   color: "text-red-500",    barColor: "bg-red-500",    label: "YouTube" },
  tiktok:    { icon: Music2,    color: "text-pink-400",   barColor: "bg-pink-400",   label: "TikTok" },
  instagram: { icon: Instagram, color: "text-fuchsia-400",barColor: "bg-fuchsia-400",label: "Instagram" },
  twitter:   { icon: Twitter,   color: "text-sky-400",    barColor: "bg-sky-400",    label: "X (Twitter)" },
  x:         { icon: Twitter,   color: "text-sky-400",    barColor: "bg-sky-400",    label: "X (Twitter)" },
  linkedin:  { icon: Linkedin,  color: "text-blue-500",   barColor: "bg-blue-500",   label: "LinkedIn" },
  facebook:  { icon: Facebook,  color: "text-blue-600",   barColor: "bg-blue-600",   label: "Facebook" },
  website:   { icon: Globe,     color: "text-emerald-400",barColor: "bg-emerald-400",label: "Website" },
};

// ── Stub recent activity for heatmap ────────────────────────────────────────────
function buildHeatmap(posts: any[]) {
  const weeks = 12;
  const days = weeks * 7;
  const result: { date: Date; count: number }[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(now, i);
    const count = posts.filter(p => {
      const d = p.scheduledAt ? new Date(p.scheduledAt) : new Date(p.createdAt);
      return isSameDay(d, day);
    }).length;
    result.push({ date: day, count });
  }
  return result;
}

const HEAT_COLORS = ["bg-white/5", "bg-emerald-900/60", "bg-emerald-600/70", "bg-emerald-500/80", "bg-emerald-400"];

function heatColor(count: number) {
  if (count === 0) return HEAT_COLORS[0];
  if (count === 1) return HEAT_COLORS[1];
  if (count === 2) return HEAT_COLORS[2];
  if (count <= 4) return HEAT_COLORS[3];
  return HEAT_COLORS[4];
}

// ── Mini Calendar ────────────────────────────────────────────────────────────────
function MiniCalendar({ posts }: { posts: any[] }) {
  const [current, setCurrent] = useState(new Date());
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(monthStart);
  const calDays = eachDayOfInterval({ start: startOfWeek(monthStart), end: endOfWeek(monthEnd) });

  const hasSched = (day: Date) => posts.some(p => p.scheduledAt && isSameDay(new Date(p.scheduledAt), day));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => setCurrent(d => { const n = new Date(d); n.setMonth(n.getMonth()-1); return n; })}
          className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs font-black text-foreground uppercase tracking-wider">{format(current, "MMMM yyyy")}</span>
        <button onClick={() => setCurrent(d => { const n = new Date(d); n.setMonth(n.getMonth()+1); return n; })}
          className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {["S","M","T","W","T","F","S"].map((d,i) => (
          <div key={i} className="text-center text-[9px] font-black text-muted-foreground py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {calDays.map((day, i) => {
          const inMonth = day.getMonth() === current.getMonth();
          const today = isToday(day);
          const sched = hasSched(day);
          return (
            <div key={i} className={cn(
              "relative flex items-center justify-center w-7 h-7 mx-auto rounded-md text-[10px] font-semibold",
              today ? "bg-primary text-primary-foreground font-black" :
              inMonth ? "text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer" : "text-muted-foreground/30"
            )}>
              {format(day, "d")}
              {sched && !today && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-emerald-400" />}
            </div>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 pt-2 border-t border-border/40">
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[9px] text-muted-foreground font-medium">Scheduled</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400" /><span className="text-[9px] text-muted-foreground font-medium">High volume</span></div>
        <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-400" /><span className="text-[9px] text-muted-foreground font-medium">Draft due</span></div>
      </div>
    </div>
  );
}

// ── Stat Card ─────────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, badge, trend, trendUp, color = "text-primary" }: any) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-muted/30 border-border/50 text-muted-foreground">{badge}</Badge>
      </div>
      <div>
        <p className={cn("text-3xl font-black tracking-tight", color)}>{value}</p>
        <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{title}</p>
      </div>
      {sub && (
        <div className={cn("flex items-center gap-1 text-[10px] font-bold", trendUp ? "text-emerald-400" : "text-rose-400")}>
          {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{sub}</span>
        </div>
      )}
      {trend && <div className="h-8 w-full opacity-60">{trend}</div>}
    </div>
  );
}

// ── Main Overview ─────────────────────────────────────────────────────────────────
const Index = () => {
  const stats = useDashboardStats();
  const { posts } = usePosts();
  const { user } = useAuth();
  const { automations } = useAutomations();
  const { notes } = useNotes();
  const navigate = useNavigate();
  const [now, setNow] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);

  const userName = user?.email?.split("@")[0] ?? "Admin";
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dayLabel = format(now, "EEEE, MMMM d, yyyy").toUpperCase();

  // Today's queue — posts scheduled today
  const todayQueue = posts
    .filter(p => p.scheduledAt && isToday(new Date(p.scheduledAt)))
    .sort((a, b) => new Date(a.scheduledAt!).getTime() - new Date(b.scheduledAt!).getTime());

  // Platform breakdown for distribution donut
  const platMap: Record<string, number> = {};
  posts.forEach(p => {
    (p as any).platforms?.forEach((pp: any) => {
      platMap[pp.platform] = (platMap[pp.platform] || 0) + 1;
    });
  });
  const platSlices = Object.entries(platMap).map(([k, v]) => ({
    name: PLATFORM_CONFIG[k]?.label ?? k,
    value: v,
    color: k === "youtube" ? "#ef4444" : k === "tiktok" ? "#f472b6" : k === "instagram" ? "#e879f9" :
           k === "twitter" || k === "x" ? "#38bdf8" : k === "linkedin" ? "#3b82f6" :
           k === "facebook" ? "#2563eb" : "#34d399"
  }));

  // Recent activity chart — last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = subDays(now, 29 - i);
    const label = format(d, "d");
    const pub = posts.filter(p => p.publishedAt && isSameDay(new Date(p.publishedAt), d)).length;
    const sched = posts.filter(p => p.scheduledAt && isSameDay(new Date(p.scheduledAt), d)).length;
    const draft = posts.filter(p => p.status === "draft" && isSameDay(new Date(p.createdAt), d)).length;
    return { label, Published: pub, Scheduled: sched, Drafts: draft };
  });

  // Heatmap
  const heatmap = buildHeatmap(posts);
  const heatWeeks: typeof heatmap[] = [];
  for (let i = 0; i < heatmap.length; i += 7) heatWeeks.push(heatmap.slice(i, i + 7));

  // Platform health mock data (% fill bars)
  const platformHealth = [
    { key: "youtube",   queued: 8,  pct: 92 },
    { key: "tiktok",    queued: 14, pct: 98 },
    { key: "instagram", queued: 21, pct: 95 },
    { key: "twitter",   queued: 21, pct: 97 },
    { key: "linkedin",  queued: 8,  pct: 88 },
    { key: "facebook",  queued: 7,  pct: 75 },
  ];

  // Goals & KPIs
  const goals = [
    { label: "Follower Growth", value: "2,840", target: "5,000", pct: 57, change: "+12.4%", up: true, color: "bg-violet-500" },
    { label: "Avg Engagement", value: "6.2%", target: "8%", pct: 78, change: "+1.1%", up: true, color: "bg-blue-500" },
    { label: "Monthly Output", value: `${stats.publishedPosts} posts`, target: "90 posts", pct: Math.min(100, Math.round((stats.publishedPosts / 90) * 100)), change: "+23%", up: true, color: "bg-emerald-500" },
    { label: "Website Traffic", value: "8,400", target: "15,000", pct: 56, change: "+18%", up: true, color: "bg-amber-500" },
  ];

  // Today's posting schedule (horizontal timeline)
  const scheduleItems = todayQueue.map(p => ({
    time: p.scheduledAt ? format(new Date(p.scheduledAt), "ha") : "",
    title: p.title.slice(0, 12) + "…",
    platform: (p as any).platforms?.[0]?.platform ?? "website",
  }));

  // Recent posts table
  const recentPosts = posts.slice(0, 6);

  // Activity feed (derived from posts)
  const activityFeed = posts.slice(0, 5).map((p, i) => ({
    text: p.status === "published"
      ? `${(p as any).platforms?.[0]?.platform ?? "Post"} published successfully`
      : p.status === "scheduled"
      ? `${(p as any).platforms?.[0]?.platform ?? "Post"} scheduled`
      : `${p.title.slice(0, 30)}… draft saved`,
    ago: `${i * 8 + 2}m ago`,
    status: p.status,
  }));

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-10 animate-in fade-in duration-500">

        {/* ── Greeting Banner ───────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-primary/10 via-card to-card border border-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-1">{dayLabel}</p>
            <h1 className="text-xl font-black tracking-tighter text-foreground">
              {greeting}, {userName.charAt(0).toUpperCase() + userName.slice(1)} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              You have <span className="text-foreground font-bold">{todayQueue.length} posts scheduled</span> today.{" "}
              Your automation queue has <span className="text-primary font-bold">{stats.scheduledPosts} items</span> ready to publish.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button onClick={() => navigate("/calendar")} className="bg-primary hover:opacity-90 text-white font-black uppercase text-[10px] tracking-widest gap-2 rounded-xl">
              <Plus className="w-4 h-4" /> Create Content
            </Button>
            <Button onClick={() => navigate("/pipeline")} variant="outline" className="border-border font-black uppercase text-[10px] tracking-widest gap-2 rounded-xl">
              <Eye className="w-4 h-4" /> View Queue ({stats.scheduledPosts})
            </Button>
          </div>
        </div>

        {/* ── 6 Stat Cards ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard title="Total Posts"  value={stats.totalPosts}     badge="All time"   sub="vs last month"   trendUp color="text-foreground" />
          <StatCard title="Scheduled"    value={stats.scheduledPosts}  badge="Upcoming"   sub={`${todayQueue.length} today`} trendUp color="text-blue-400" />
          <StatCard title="Drafts"       value={stats.draftPosts}      badge="In progress" sub={stats.draftPosts > 0 ? `${stats.draftPosts} need review` : "All clear"} trendUp={false} color="text-amber-400" />
          <StatCard title="Published"    value={stats.publishedPosts}  badge="This week"  sub="vs last week"    trendUp color="text-emerald-400" />
          <StatCard title="Engagement"   value="6.2%"                  badge="Avg rate"   sub="1.1% this week"  trendUp color="text-violet-400" />
          <StatCard title="Auto Success" value="98.5%"                 badge="Live"       sub="0.3% this week"  trendUp color="text-primary" />
        </div>

        {/* ── Posts Activity Chart + Platform Health ────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Chart */}
          <div className="xl:col-span-2 bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black text-foreground">Posts Activity</h2>
                <p className="text-[10px] text-muted-foreground">Published vs Scheduled — Last 30 days</p>
              </div>
              <div className="flex gap-1">
                {["30d","7d","90d"].map(t => (
                  <button key={t} className="px-3 py-1 text-[10px] font-black rounded-lg bg-muted text-muted-foreground hover:text-foreground transition-colors">{t}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-emerald-400 inline-block" /><span className="text-[10px] text-muted-foreground">Published</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-blue-400 inline-block" /><span className="text-[10px] text-muted-foreground">Scheduled</span></div>
              <div className="flex items-center gap-1.5"><span className="w-3 h-1 rounded-full bg-violet-400 inline-block" /><span className="text-[10px] text-muted-foreground">Drafts</span></div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData} margin={{ left: -20, right: 0, top: 5, bottom: 0 }}>
                <defs>
                  <linearGradient id="gPub" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/><stop offset="95%" stopColor="#34d399" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gSch" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3}/><stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/></linearGradient>
                  <linearGradient id="gDr"  x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3}/><stop offset="95%" stopColor="#a78bfa" stopOpacity={0}/></linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} axisLine={false} interval={4} />
                <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(222 47% 6%)", border: "1px solid hsl(217 33% 17%)", borderRadius: 12, fontSize: 11 }} />
                <Area type="monotone" dataKey="Published" stroke="#34d399" strokeWidth={2} fill="url(#gPub)" dot={false} />
                <Area type="monotone" dataKey="Scheduled" stroke="#60a5fa" strokeWidth={2} fill="url(#gSch)" dot={false} />
                <Area type="monotone" dataKey="Drafts"    stroke="#a78bfa" strokeWidth={2} fill="url(#gDr)"  dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Health */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-foreground">Platform Health</h2>
              <button onClick={() => navigate("/platforms")} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">
                Manage <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-3">
              {platformHealth.map(({ key, queued, pct }) => {
                const cfg = PLATFORM_CONFIG[key];
                if (!cfg) return null;
                const Icon = cfg.icon;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <Icon className={cn("w-4 h-4 shrink-0", cfg.color)} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-foreground truncate">{cfg.label}</span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[9px] text-muted-foreground">{queued} queued</span>
                          <span className={cn("text-[10px] font-black", pct >= 90 ? "text-emerald-400" : pct >= 70 ? "text-amber-400" : "text-rose-400")}>{pct}%</span>
                        </div>
                      </div>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", cfg.barColor)} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Distribution + Today's Queue + Mini Calendar ─────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Distribution donut */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-foreground">Distribution</h2>
              <button onClick={() => navigate("/analytics")} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">Details <ArrowRight className="w-3 h-3" /></button>
            </div>
            {platSlices.length > 0 ? (
              <>
                <div className="flex items-center justify-center mb-4">
                  <PieChart width={140} height={140}>
                    <Pie data={platSlices} cx={65} cy={65} innerRadius={42} outerRadius={60} dataKey="value" strokeWidth={2} stroke="hsl(222 47% 6%)">
                      {platSlices.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                    <text x={65} y={61} textAnchor="middle" className="fill-foreground" style={{ fontSize: 18, fontWeight: 900, fill: "hsl(213 31% 91%)" }}>{stats.totalPosts}</text>
                    <text x={65} y={76} textAnchor="middle" style={{ fontSize: 9, fill: "hsl(215 20% 65%)" }}>total posts</text>
                  </PieChart>
                </div>
                <div className="space-y-2">
                  {platSlices.map(s => (
                    <div key={s.name} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} /><span className="text-muted-foreground">{s.name}</span></div>
                      <span className="font-black text-foreground">{s.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <BarChart3 className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs">No platform data yet</p>
              </div>
            )}
          </div>

          {/* Today's Queue */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h2 className="text-sm font-black text-foreground">Today's Queue</h2>
              </div>
              <button onClick={() => navigate("/pipeline")} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
            </div>
            <div className="space-y-2">
              {todayQueue.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">Nothing scheduled today</p>
              ) : todayQueue.slice(0, 8).map((post: any) => {
                const plat = post.platforms?.[0]?.platform ?? "website";
                const cfg = PLATFORM_CONFIG[plat];
                const Icon = cfg?.icon ?? Globe;
                const timeStr = post.scheduledAt ? format(new Date(post.scheduledAt), "HH:mm") : "--:--";
                const statusColor = post.status === "scheduled" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                                    post.status === "draft" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" :
                                    "text-blue-400 bg-blue-400/10 border-blue-400/20";
                return (
                  <div key={post.id} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
                    <span className="text-[10px] font-black text-muted-foreground w-10 shrink-0 tabular-nums">{timeStr}</span>
                    <Icon className={cn("w-4 h-4 shrink-0", cfg?.color ?? "text-muted-foreground")} />
                    <span className="text-xs text-foreground flex-1 truncate font-medium">{post.title}</span>
                    <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded border shrink-0", statusColor)}>
                      {post.status === "scheduled" ? "READY" : post.status.toUpperCase()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mini Calendar */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-black text-foreground">Content Calendar</h2>
            </div>
            <MiniCalendar posts={posts} />
          </div>
        </div>

        {/* ── Publishing Heatmap + Activity Feed ───────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Heatmap */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black text-foreground">Publishing Heatmap</h2>
                <p className="text-[10px] text-muted-foreground">Posts per day — last 12 weeks</p>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground">
                <span>Less</span>
                {HEAT_COLORS.map((c, i) => <span key={i} className={cn("w-3 h-3 rounded-sm", c)} />)}
                <span>More</span>
              </div>
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {heatWeeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1 shrink-0">
                  {week.map((day, di) => (
                    <div
                      key={di}
                      title={`${format(day.date, "MMM d")}: ${day.count} posts`}
                      className={cn("w-3.5 h-3.5 rounded-sm transition-all hover:ring-1 hover:ring-primary/50", heatColor(day.count))}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-foreground">Activity Feed</h2>
              <span className="flex items-center gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>
            <div className="space-y-3">
              {activityFeed.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-6">No recent activity</p>
              ) : activityFeed.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0 mt-0.5",
                    item.status === "published" ? "bg-emerald-500/10" :
                    item.status === "scheduled" ? "bg-blue-500/10" : "bg-amber-500/10"
                  )}>
                    {item.status === "published" ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> :
                     item.status === "scheduled" ? <Clock className="w-3.5 h-3.5 text-blue-400" /> :
                     <FileText className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground font-medium leading-tight">{item.text}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{item.ago}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Recent Posts Table + Quick Notes ─────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Recent Posts */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-foreground">Recent Posts</h2>
              <button onClick={() => navigate("/articles")} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/40">
                    <th className="pb-2 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground">Content</th>
                    <th className="pb-2 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground">Platform</th>
                    <th className="pb-2 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground">Status</th>
                    <th className="pb-2 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {recentPosts.length === 0 ? (
                    <tr><td colSpan={4} className="py-6 text-center text-muted-foreground">No posts yet</td></tr>
                  ) : recentPosts.map(post => {
                    const plat = (post as any).platforms?.[0]?.platform ?? "website";
                    const cfg = PLATFORM_CONFIG[plat];
                    const statusColor = post.status === "published" ? "text-emerald-400" :
                                        post.status === "scheduled" ? "text-blue-400" : "text-amber-400";
                    return (
                      <tr key={post.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-2.5 pr-3">
                          <span className="text-foreground font-medium truncate max-w-[160px] block">{post.title}</span>
                        </td>
                        <td className="py-2.5 pr-3">
                          <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-md", cfg?.color ?? "text-muted-foreground", "bg-muted/50")}>
                            {cfg?.label ?? plat}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3">
                          <span className={cn("font-black capitalize", statusColor)}>{post.status}</span>
                        </td>
                        <td className="py-2.5 text-muted-foreground">
                          {format(new Date(post.createdAt), "MMM d")}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Notes */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-foreground">Quick Notes</h2>
              <button onClick={() => navigate("/notes")} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></button>
            </div>
            <div className="space-y-3">
              {notes.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No notes yet</p>
              ) : notes.slice(0, 4).map((note: any) => (
                <div key={note.id} className="p-3 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
                  <p className="text-xs font-bold text-foreground">{note.title}</p>
                  {note.content && <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{note.content}</p>}
                </div>
              ))}
              <button onClick={() => navigate("/notes")} className="w-full py-2 border border-dashed border-border/50 rounded-xl text-[10px] font-black text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors">
                + Add Note
              </button>
            </div>
          </div>
        </div>

        {/* ── Goals & KPIs + Automation Status ─────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Goals */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-black text-foreground">Goals & KPIs</h2>
                <p className="text-[10px] text-muted-foreground">Q3 2025 targets — updated in real-time</p>
              </div>
              <button onClick={() => navigate("/analytics")} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">Full Report <ArrowRight className="w-3 h-3" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {goals.map(g => (
                <div key={g.label} className="bg-muted/20 border border-border/40 rounded-xl p-4">
                  <div className="flex justify-end mb-2">
                    <span className={cn("text-[10px] font-black", g.up ? "text-emerald-400" : "text-rose-400")}>{g.change}</span>
                  </div>
                  <p className="text-2xl font-black text-foreground tracking-tight">{g.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{g.label} · Target: {g.target}</p>
                  <div className="mt-3">
                    <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
                      <span>0</span><span>{g.target}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full", g.color)} style={{ width: `${g.pct}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Automation Status */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-black text-foreground">Automation Status</h2>
              </div>
              <button onClick={() => navigate("/automation")} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">Manage <ArrowRight className="w-3 h-3" /></button>
            </div>
            {automations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Sparkles className="w-8 h-8 mb-2 opacity-20" />
                <p className="text-xs">No automations configured</p>
                <button onClick={() => navigate("/automation")} className="mt-2 text-[10px] font-black text-primary hover:underline">Set up automation →</button>
              </div>
            ) : (
              <div className="space-y-3">
                {automations.slice(0, 6).map((a: any) => (
                  <div key={a.id} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-foreground truncate">{a.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {a.frequency ?? "Daily"} · {a.platform ?? "Multi-platform"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[9px] font-black text-blue-400 bg-blue-400/10 border border-blue-400/20 px-2 py-0.5 rounded">
                        {a.lastRunAt ? `${Math.floor((Date.now() - new Date(a.lastRunAt).getTime()) / 3600000)}h ago` : "pending"}
                      </span>
                      <div className={cn("w-8 h-4 rounded-full relative cursor-pointer transition-colors",
                        a.status === "active" ? "bg-primary" : "bg-muted"
                      )}>
                        <div className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all",
                          a.status === "active" ? "right-0.5" : "left-0.5"
                        )} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Today's Posting Schedule Timeline ────────────────────────── */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-black text-foreground">Today's Posting Schedule</h2>
              <p className="text-[10px] text-muted-foreground">Automation-driven publishing timeline</p>
            </div>
            <button onClick={() => navigate("/calendar")} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">Edit Schedule <ArrowRight className="w-3 h-3" /></button>
          </div>
          {/* Timeline ruler */}
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Hour labels */}
              <div className="grid grid-cols-14 gap-0 mb-2 pl-24">
                {["6AM","7AM","8AM","9AM","10AM","11AM","12PM","1PM","2PM","3PM","4PM","5PM","6PM","7PM"].map(h => (
                  <div key={h} className="text-[9px] text-muted-foreground font-bold text-center">{h}</div>
                ))}
              </div>
              {/* Platform rows */}
              {Object.entries(PLATFORM_CONFIG).slice(0, 5).map(([key, cfg]) => {
                const Icon = cfg.icon;
                const platPosts = todayQueue.filter(p => (p as any).platforms?.[0]?.platform === key);
                return (
                  <div key={key} className="flex items-center gap-2 mb-2">
                    <div className="w-24 shrink-0 flex items-center gap-2">
                      <Icon className={cn("w-3.5 h-3.5 shrink-0", cfg.color)} />
                      <span className="text-[10px] font-bold text-muted-foreground truncate">{cfg.label}</span>
                    </div>
                    <div className="flex-1 h-7 bg-muted/20 rounded-lg relative border border-border/20">
                      {platPosts.map(post => {
                        const h = new Date(post.scheduledAt!).getHours();
                        const m = new Date(post.scheduledAt!).getMinutes();
                        const offset = ((h - 6) * 60 + m) / (14 * 60) * 100;
                        return (
                          <div
                            key={post.id}
                            style={{ left: `${Math.max(0, Math.min(90, offset))}%` }}
                            title={post.title}
                            className={cn("absolute top-1 h-5 px-2 rounded text-[9px] font-black text-white flex items-center max-w-[15%] truncate cursor-pointer hover:z-10", cfg.barColor)}
                          >
                            {post.title.slice(0, 10)}…
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Index;
