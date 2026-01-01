import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from "recharts";
import { toast } from "@/hooks/use-toast";
import {
  Youtube,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Music2,
  Settings,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Users,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  Plus,
  Globe,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Zap,
  MessageCircle,
  Share2,
  Activity,
  Calendar,
  Target,
  Send,
  Edit,
  Trash2,
  MoreVertical,
  Image,
  Video,
  FileText,
  CalendarClock,
} from "lucide-react";

const platforms = [
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    colorClass: "platform-youtube",
    bgGradient: "from-red-500/20 to-red-600/10",
    connected: true,
    username: "@ContentCreator",
    followers: 125000,
    followersDisplay: "125K",
    posts: 342,
    lastSync: "2 min ago",
    status: "active",
    stats: { views: "2.5M", engagement: "8.2%", shares: "12.4K" },
    weeklyGrowth: 3.2,
    topPost: { likes: 15600, comments: 1240, title: "How to Go Viral in 2024" },
    weeklyData: [
      { day: "Mon", followers: 123000, views: 45000 },
      { day: "Tue", followers: 123400, views: 52000 },
      { day: "Wed", followers: 123800, views: 48000 },
      { day: "Thu", followers: 124200, views: 61000 },
      { day: "Fri", followers: 124600, views: 58000 },
      { day: "Sat", followers: 124800, views: 72000 },
      { day: "Sun", followers: 125000, views: 68000 },
    ],
    schedule: { pending: 5, published: 23 },
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    colorClass: "platform-tiktok",
    bgGradient: "from-pink-500/20 via-purple-500/10 to-cyan-500/10",
    connected: true,
    username: "@creator_hub",
    followers: 89000,
    followersDisplay: "89K",
    posts: 156,
    lastSync: "5 min ago",
    status: "active",
    stats: { views: "5.1M", engagement: "12.4%", shares: "45.2K" },
    weeklyGrowth: 5.8,
    topPost: { likes: 45200, comments: 3100, title: "Viral Dance Challenge" },
    weeklyData: [
      { day: "Mon", followers: 85000, views: 120000 },
      { day: "Tue", followers: 85800, views: 145000 },
      { day: "Wed", followers: 86500, views: 132000 },
      { day: "Thu", followers: 87200, views: 189000 },
      { day: "Fri", followers: 87800, views: 210000 },
      { day: "Sat", followers: 88400, views: 245000 },
      { day: "Sun", followers: 89000, views: 198000 },
    ],
    schedule: { pending: 8, published: 45 },
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    colorClass: "platform-instagram",
    bgGradient: "from-purple-500/20 via-pink-500/10 to-orange-400/10",
    connected: true,
    username: "@content.creator",
    followers: 67000,
    followersDisplay: "67K",
    posts: 289,
    lastSync: "10 min ago",
    status: "active",
    stats: { views: "890K", engagement: "6.8%", shares: "8.9K" },
    weeklyGrowth: 2.1,
    topPost: { likes: 8900, comments: 456, title: "Behind the Scenes" },
    weeklyData: [
      { day: "Mon", followers: 65500, views: 28000 },
      { day: "Tue", followers: 65800, views: 32000 },
      { day: "Wed", followers: 66100, views: 29000 },
      { day: "Thu", followers: 66400, views: 35000 },
      { day: "Fri", followers: 66700, views: 38000 },
      { day: "Sat", followers: 66850, views: 42000 },
      { day: "Sun", followers: 67000, views: 39000 },
    ],
    schedule: { pending: 3, published: 18 },
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    colorClass: "platform-facebook",
    bgGradient: "from-blue-600/20 to-blue-700/10",
    connected: true,
    username: "Content Creator Page",
    followers: 45000,
    followersDisplay: "45K",
    posts: 178,
    lastSync: "15 min ago",
    status: "active",
    stats: { views: "320K", engagement: "4.2%", shares: "2.1K" },
    weeklyGrowth: -0.5,
    topPost: { likes: 2300, comments: 189, title: "Community Update" },
    weeklyData: [
      { day: "Mon", followers: 45200, views: 12000 },
      { day: "Tue", followers: 45150, views: 11000 },
      { day: "Wed", followers: 45100, views: 10500 },
      { day: "Thu", followers: 45050, views: 11200 },
      { day: "Fri", followers: 45020, views: 10800 },
      { day: "Sat", followers: 45010, views: 9500 },
      { day: "Sun", followers: 45000, views: 9200 },
    ],
    schedule: { pending: 2, published: 12 },
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    colorClass: "platform-twitter",
    bgGradient: "from-zinc-500/20 to-zinc-600/10",
    connected: false,
    username: null,
    followers: 0,
    followersDisplay: null,
    posts: 0,
    lastSync: null,
    status: "disconnected",
    stats: null,
    weeklyGrowth: 0,
    topPost: null,
    weeklyData: [],
    schedule: null,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    colorClass: "platform-linkedin",
    bgGradient: "from-blue-700/20 to-blue-800/10",
    connected: true,
    username: "Content Creator",
    followers: 12000,
    followersDisplay: "12K",
    posts: 67,
    lastSync: "1 hour ago",
    status: "active",
    stats: { views: "156K", engagement: "5.1%", shares: "3.2K" },
    weeklyGrowth: 4.2,
    topPost: { likes: 890, comments: 67, title: "Industry Insights" },
    weeklyData: [
      { day: "Mon", followers: 11600, views: 5200 },
      { day: "Tue", followers: 11700, views: 5800 },
      { day: "Wed", followers: 11750, views: 6100 },
      { day: "Thu", followers: 11820, views: 7200 },
      { day: "Fri", followers: 11900, views: 6800 },
      { day: "Sat", followers: 11950, views: 4500 },
      { day: "Sun", followers: 12000, views: 4200 },
    ],
    schedule: { pending: 1, published: 8 },
  },
];

const totalStats = {
  totalFollowers: "338K",
  totalViews: "8.9M",
  avgEngagement: "7.3%",
  connectedPlatforms: 5,
  totalPosts: 1032,
  weeklyGrowth: 2.96,
  totalShares: "71.8K",
  scheduledPosts: 19,
};

const recentActivity = [
  { platform: "TikTok", icon: Music2, action: "Video went viral", detail: "45K+ likes in 24 hours", time: "2 hours ago", positive: true, type: "milestone" },
  { platform: "YouTube", icon: Youtube, action: "New milestone", detail: "Reached 125K subscribers", time: "5 hours ago", positive: true, type: "milestone" },
  { platform: "Instagram", icon: Instagram, action: "Story engagement spike", detail: "2,400 interactions", time: "1 day ago", positive: true, type: "engagement" },
  { platform: "Facebook", icon: Facebook, action: "Reach decreased", detail: "-5% compared to last week", time: "2 days ago", positive: false, type: "alert" },
  { platform: "LinkedIn", icon: Linkedin, action: "Article featured", detail: "Added to LinkedIn News", time: "3 days ago", positive: true, type: "feature" },
];

const availablePlatforms = [
  { id: "pinterest", name: "Pinterest", icon: "📌", description: "Visual discovery and bookmarking", users: "450M+" },
  { id: "snapchat", name: "Snapchat", icon: "👻", description: "Stories and AR content", users: "750M+" },
  { id: "threads", name: "Threads", icon: "🧵", description: "Text-based conversations", users: "150M+" },
];

const overallPerformance = [
  { name: "Week 1", followers: 310000, views: 7200000, engagement: 6.8 },
  { name: "Week 2", followers: 318000, views: 7800000, engagement: 7.0 },
  { name: "Week 3", followers: 325000, views: 8200000, engagement: 7.1 },
  { name: "Week 4", followers: 338000, views: 8900000, engagement: 7.3 },
];

const platformColors: Record<string, string> = {
  youtube: "hsl(var(--youtube))",
  tiktok: "hsl(var(--tiktok))",
  instagram: "hsl(var(--instagram))",
  facebook: "hsl(var(--facebook))",
  linkedin: "hsl(var(--linkedin))",
  twitter: "hsl(var(--twitter))",
};

interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: "scheduled" | "draft" | "published";
  type: "text" | "image" | "video" | "carousel";
}

const initialScheduledPosts: ScheduledPost[] = [
  {
    id: "1",
    title: "New Product Launch Announcement",
    content: "Exciting news! We're launching our new product line next week. Stay tuned for exclusive previews and early access offers!",
    platforms: ["instagram", "facebook", "linkedin"],
    scheduledDate: "2026-01-03",
    scheduledTime: "09:00",
    status: "scheduled",
    type: "image",
  },
  {
    id: "2",
    title: "Behind the Scenes Video",
    content: "Take a peek behind the curtain! Watch how our team brings creative ideas to life.",
    platforms: ["youtube", "tiktok"],
    scheduledDate: "2026-01-04",
    scheduledTime: "14:00",
    status: "scheduled",
    type: "video",
  },
  {
    id: "3",
    title: "Weekly Tips Thread",
    content: "5 tips to boost your productivity this week. Thread incoming! 🧵",
    platforms: ["twitter"],
    scheduledDate: "2026-01-05",
    scheduledTime: "10:00",
    status: "draft",
    type: "text",
  },
  {
    id: "4",
    title: "Community Q&A Session",
    content: "Join us for our monthly Q&A! Drop your questions below and we'll answer them live.",
    platforms: ["instagram", "youtube"],
    scheduledDate: "2026-01-06",
    scheduledTime: "18:00",
    status: "scheduled",
    type: "video",
  },
];

export default function Platforms() {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>(initialScheduledPosts);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    platforms: [] as string[],
    scheduledDate: "",
    scheduledTime: "",
    type: "text" as "text" | "image" | "video" | "carousel",
  });
  
  const connectedPlatforms = platforms.filter((p) => p.connected);
  const disconnectedPlatforms = platforms.filter((p) => !p.connected);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const getPlatformColor = (id: string) => platformColors[id] || "hsl(var(--primary))";
  
  const getPlatformIcon = (id: string) => {
    const platform = platforms.find(p => p.id === id);
    return platform?.icon || Globe;
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "image": return Image;
      case "video": return Video;
      case "carousel": return FileText;
      default: return FileText;
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content || newPost.platforms.length === 0) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and select at least one platform.",
        variant: "destructive",
      });
      return;
    }

    const post: ScheduledPost = {
      id: Date.now().toString(),
      ...newPost,
      status: newPost.scheduledDate && newPost.scheduledTime ? "scheduled" : "draft",
    };

    setScheduledPosts([...scheduledPosts, post]);
    setNewPost({
      title: "",
      content: "",
      platforms: [],
      scheduledDate: "",
      scheduledTime: "",
      type: "text",
    });
    setIsCreateDialogOpen(false);
    toast({
      title: "Post created",
      description: post.status === "scheduled" ? "Your post has been scheduled." : "Your post has been saved as a draft.",
    });
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;
    
    setScheduledPosts(scheduledPosts.map(p => 
      p.id === editingPost.id ? editingPost : p
    ));
    setEditingPost(null);
    toast({
      title: "Post updated",
      description: "Your post has been updated successfully.",
    });
  };

  const handleDeletePost = (id: string) => {
    setScheduledPosts(scheduledPosts.filter(p => p.id !== id));
    toast({
      title: "Post deleted",
      description: "The post has been removed.",
    });
  };

  const handlePublishNow = (id: string) => {
    setScheduledPosts(scheduledPosts.map(p =>
      p.id === id ? { ...p, status: "published" as const } : p
    ));
    toast({
      title: "Post published",
      description: "Your post has been published successfully.",
    });
  };

  const togglePlatformSelection = (platformId: string, isNew: boolean = true) => {
    if (isNew) {
      setNewPost(prev => ({
        ...prev,
        platforms: prev.platforms.includes(platformId)
          ? prev.platforms.filter(p => p !== platformId)
          : [...prev.platforms, platformId]
      }));
    } else if (editingPost) {
      setEditingPost({
        ...editingPost,
        platforms: editingPost.platforms.includes(platformId)
          ? editingPost.platforms.filter(p => p !== platformId)
          : [...editingPost.platforms, platformId]
      });
    }
  };

  return (
    <DashboardLayout>
      <TooltipProvider>
        <div className="space-y-6 animate-fade-in">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Platforms</h1>
                  <p className="text-muted-foreground">Manage your connected social media accounts</p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="gap-2"
                onClick={handleSync}
                disabled={syncing}
              >
                <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
                {syncing ? "Syncing..." : "Sync All"}
              </Button>
              <Button className="gap-2 bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Add Platform
              </Button>
            </div>
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { icon: Users, label: "Total Followers", value: totalStats.totalFollowers, change: `+${totalStats.weeklyGrowth}%`, positive: true },
              { icon: Eye, label: "Total Views", value: totalStats.totalViews, change: "+12.4%", positive: true },
              { icon: Heart, label: "Avg Engagement", value: totalStats.avgEngagement, change: "+0.3%", positive: true },
              { icon: Share2, label: "Total Shares", value: totalStats.totalShares, change: "+8.2%", positive: true },
              { icon: CheckCircle2, label: "Connected", value: `${totalStats.connectedPlatforms}/6`, subtext: "platforms" },
              { icon: BarChart3, label: "Total Posts", value: totalStats.totalPosts.toLocaleString(), subtext: "all platforms" },
              { icon: Calendar, label: "Scheduled", value: totalStats.scheduledPosts.toString(), subtext: "pending posts" },
              { icon: TrendingUp, label: "Growth Rate", value: `+${totalStats.weeklyGrowth}%`, subtext: "weekly avg", highlight: true },
            ].map((stat, index) => (
              <Card
                key={index}
                className={`bg-card border-border transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 ${
                  stat.highlight ? "border-primary/20 bg-gradient-to-br from-primary/5 to-transparent" : ""
                }`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <stat.icon className={`h-3.5 w-3.5 ${stat.highlight ? "text-primary" : "text-muted-foreground"}`} />
                    <span className="text-[10px] text-muted-foreground truncate">{stat.label}</span>
                  </div>
                  <p className={`text-lg font-bold ${stat.highlight ? "text-primary" : "text-foreground"}`}>{stat.value}</p>
                  {stat.change ? (
                    <p className={`text-[10px] flex items-center gap-0.5 ${stat.positive ? "text-emerald-500" : "text-red-500"}`}>
                      {stat.positive ? <ArrowUpRight className="h-2.5 w-2.5" /> : <ArrowDownRight className="h-2.5 w-2.5" />}
                      {stat.change} this week
                    </p>
                  ) : (
                    <p className="text-[10px] text-muted-foreground">{stat.subtext}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Overview Chart */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Performance Overview</CardTitle>
                </div>
                <div className="flex gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="text-muted-foreground">Followers</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-chart-2" />
                    <span className="text-muted-foreground">Engagement %</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  followers: { label: "Followers", color: "hsl(var(--primary))" },
                  engagement: { label: "Engagement", color: "hsl(var(--chart-2))" },
                }}
                className="h-[180px] w-full"
              >
                <AreaChart data={overallPerformance}>
                  <defs>
                    <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area type="monotone" dataKey="followers" stroke="hsl(var(--primary))" fill="url(#followerGradient)" strokeWidth={2} />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Tabs defaultValue="connected" className="space-y-4">
            <TabsList className="bg-muted/50 flex-wrap">
              <TabsTrigger value="connected" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                Connected ({connectedPlatforms.length})
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2">
                <CalendarClock className="h-4 w-4" />
                Schedule ({scheduledPosts.filter(p => p.status !== "published").length})
              </TabsTrigger>
              <TabsTrigger value="available" className="gap-2">
                <Plus className="h-4 w-4" />
                Available ({disconnectedPlatforms.length + availablePlatforms.length})
              </TabsTrigger>
              <TabsTrigger value="activity" className="gap-2">
                <Zap className="h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="connected" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {connectedPlatforms.map((platform) => (
                  <Card
                    key={platform.id}
                    className={`bg-card border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 cursor-pointer ${
                      selectedPlatform === platform.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedPlatform(selectedPlatform === platform.id ? null : platform.id)}
                  >
                    <div
                      className="h-1.5"
                      style={{ background: getPlatformColor(platform.id) }}
                    />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="p-2.5 rounded-xl"
                            style={{ background: `${getPlatformColor(platform.id)}20` }}
                          >
                            <platform.icon
                              className="h-5 w-5"
                              style={{ color: getPlatformColor(platform.id) }}
                            />
                          </div>
                          <div>
                            <CardTitle className="text-base flex items-center gap-2">
                              {platform.name}
                              {platform.weeklyGrowth > 5 && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Badge variant="secondary" className="bg-primary/20 text-primary text-[10px] px-1.5">
                                      <TrendingUp className="h-3 w-3 mr-0.5" />
                                      Hot
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>Growing fast this week!</TooltipContent>
                                </Tooltip>
                              )}
                            </CardTitle>
                            <CardDescription className="text-xs">{platform.username}</CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant="default"
                          className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-0"
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { label: "Followers", value: platform.followersDisplay },
                          { label: "Views", value: platform.stats?.views },
                          { label: "Engagement", value: platform.stats?.engagement },
                        ].map((stat) => (
                          <div key={stat.label} className="p-2 rounded-lg bg-muted/50 text-center">
                            <p className="text-lg font-bold text-foreground">{stat.value}</p>
                            <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Mini Chart */}
                      {platform.weeklyData.length > 0 && (
                        <div className="h-16 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={platform.weeklyData}>
                              <Bar
                                dataKey="views"
                                fill={getPlatformColor(platform.id)}
                                radius={[2, 2, 0, 0]}
                                opacity={0.8}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Growth Progress */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Weekly Growth</span>
                          <span
                            className={platform.weeklyGrowth >= 0 ? "text-emerald-500" : "text-red-500"}
                          >
                            {platform.weeklyGrowth >= 0 ? "+" : ""}
                            {platform.weeklyGrowth}%
                          </span>
                        </div>
                        <Progress
                          value={Math.min(Math.abs(platform.weeklyGrowth) * 10, 100)}
                          className="h-1.5"
                        />
                      </div>

                      {/* Top Post */}
                      {platform.topPost && (
                        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                          <p className="text-[10px] text-muted-foreground mb-1.5 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Top Performing Post
                          </p>
                          <p className="text-xs font-medium text-foreground mb-2 truncate">
                            "{platform.topPost.title}"
                          </p>
                          <div className="flex gap-3 text-xs">
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Heart className="h-3 w-3 text-red-400" />
                              {platform.topPost.likes.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <MessageCircle className="h-3 w-3 text-blue-400" />
                              {platform.topPost.comments.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Schedule Info */}
                      {platform.schedule && (
                        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            <span className="text-xs text-foreground">
                              {platform.schedule.pending} posts scheduled
                            </span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {platform.schedule.published} published
                          </Badge>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Synced {platform.lastSync}
                        </div>
                        <Switch checked={platform.status === "active"} />
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                          <Settings className="h-3 w-3" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 gap-1 text-xs">
                          <BarChart3 className="h-3 w-3" />
                          Analytics
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Scheduled Posts</h3>
                  <p className="text-sm text-muted-foreground">Manage and schedule content across all platforms</p>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4" />
                      Create Post
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Create New Post</DialogTitle>
                      <DialogDescription>
                        Schedule a post to be published across your connected platforms.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter post title..."
                          value={newPost.title}
                          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                          id="content"
                          placeholder="Write your post content..."
                          rows={4}
                          value={newPost.content}
                          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content Type</Label>
                        <Select
                          value={newPost.type}
                          onValueChange={(value: "text" | "image" | "video" | "carousel") => 
                            setNewPost({ ...newPost, type: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select content type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text Post</SelectItem>
                            <SelectItem value="image">Image Post</SelectItem>
                            <SelectItem value="video">Video Post</SelectItem>
                            <SelectItem value="carousel">Carousel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Platforms</Label>
                        <div className="flex flex-wrap gap-2">
                          {connectedPlatforms.map((platform) => (
                            <div
                              key={platform.id}
                              className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                                newPost.platforms.includes(platform.id)
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                              onClick={() => togglePlatformSelection(platform.id)}
                            >
                              <Checkbox
                                checked={newPost.platforms.includes(platform.id)}
                                onCheckedChange={() => togglePlatformSelection(platform.id)}
                              />
                              <platform.icon
                                className="h-4 w-4"
                                style={{ color: getPlatformColor(platform.id) }}
                              />
                              <span className="text-sm">{platform.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="date">Schedule Date</Label>
                          <Input
                            id="date"
                            type="date"
                            value={newPost.scheduledDate}
                            onChange={(e) => setNewPost({ ...newPost, scheduledDate: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="time">Schedule Time</Label>
                          <Input
                            id="time"
                            type="time"
                            value={newPost.scheduledTime}
                            onChange={(e) => setNewPost({ ...newPost, scheduledTime: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleCreatePost} className="gap-2">
                        <Send className="h-4 w-4" />
                        {newPost.scheduledDate && newPost.scheduledTime ? "Schedule Post" : "Save as Draft"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Post Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <CalendarClock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {scheduledPosts.filter(p => p.status === "scheduled").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Scheduled</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-yellow-500/10">
                      <FileText className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {scheduledPosts.filter(p => p.status === "draft").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Drafts</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card border-border">
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-emerald-500/10">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {scheduledPosts.filter(p => p.status === "published").length}
                      </p>
                      <p className="text-sm text-muted-foreground">Published</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Posts List */}
              <div className="space-y-3">
                {scheduledPosts.length === 0 ? (
                  <Card className="bg-card border-border border-dashed">
                    <CardContent className="p-8 text-center">
                      <CalendarClock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold text-lg mb-2 text-foreground">No scheduled posts</h3>
                      <p className="text-muted-foreground mb-4">Create your first post to get started</p>
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Create Post
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  scheduledPosts.map((post) => {
                    const TypeIcon = getPostTypeIcon(post.type);
                    return (
                      <Card key={post.id} className="bg-card border-border hover:border-primary/30 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 rounded-lg bg-muted/50">
                              <TypeIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-foreground truncate">{post.title}</h4>
                                <Badge
                                  variant="outline"
                                  className={`text-[10px] ${
                                    post.status === "scheduled"
                                      ? "border-primary/50 text-primary"
                                      : post.status === "published"
                                      ? "border-emerald-500/50 text-emerald-500"
                                      : "border-yellow-500/50 text-yellow-500"
                                  }`}
                                >
                                  {post.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{post.content}</p>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1">
                                  {post.platforms.map((platformId) => {
                                    const PlatformIcon = getPlatformIcon(platformId);
                                    return (
                                      <div
                                        key={platformId}
                                        className="p-1 rounded"
                                        style={{ background: `${getPlatformColor(platformId)}20` }}
                                      >
                                        <PlatformIcon
                                          className="h-3.5 w-3.5"
                                          style={{ color: getPlatformColor(platformId) }}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                                {post.scheduledDate && post.scheduledTime && (
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(`${post.scheduledDate}T${post.scheduledTime}`).toLocaleString(undefined, {
                                      month: "short",
                                      day: "numeric",
                                      hour: "numeric",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {post.status !== "published" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 text-xs"
                                  onClick={() => handlePublishNow(post.id)}
                                >
                                  <Send className="h-3 w-3" />
                                  Publish
                                </Button>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setEditingPost(post)}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeletePost(post.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Edit Post Dialog */}
            <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Post</DialogTitle>
                  <DialogDescription>
                    Update your scheduled post details.
                  </DialogDescription>
                </DialogHeader>
                {editingPost && (
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-title">Title</Label>
                      <Input
                        id="edit-title"
                        value={editingPost.title}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-content">Content</Label>
                      <Textarea
                        id="edit-content"
                        rows={4}
                        value={editingPost.content}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Platforms</Label>
                      <div className="flex flex-wrap gap-2">
                        {connectedPlatforms.map((platform) => (
                          <div
                            key={platform.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                              editingPost.platforms.includes(platform.id)
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => togglePlatformSelection(platform.id, false)}
                          >
                            <Checkbox
                              checked={editingPost.platforms.includes(platform.id)}
                              onCheckedChange={() => togglePlatformSelection(platform.id, false)}
                            />
                            <platform.icon
                              className="h-4 w-4"
                              style={{ color: getPlatformColor(platform.id) }}
                            />
                            <span className="text-sm">{platform.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-date">Schedule Date</Label>
                        <Input
                          id="edit-date"
                          type="date"
                          value={editingPost.scheduledDate}
                          onChange={(e) => setEditingPost({ ...editingPost, scheduledDate: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-time">Schedule Time</Label>
                        <Input
                          id="edit-time"
                          type="time"
                          value={editingPost.scheduledTime}
                          onChange={(e) => setEditingPost({ ...editingPost, scheduledTime: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEditingPost(null)}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdatePost}>
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <TabsContent value="available" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {disconnectedPlatforms.map((platform) => (
                  <Card
                    key={platform.id}
                    className="bg-card border-border border-dashed hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className="p-4 rounded-2xl mx-auto w-fit mb-4"
                        style={{ background: `${getPlatformColor(platform.id)}20` }}
                      >
                        <platform.icon
                          className="h-8 w-8"
                          style={{ color: getPlatformColor(platform.id) }}
                        />
                      </div>
                      <h3 className="font-semibold text-lg mb-1 text-foreground">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect your {platform.name} account to track performance
                      </p>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect {platform.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {availablePlatforms.map((platform) => (
                  <Card
                    key={platform.id}
                    className="bg-card border-border border-dashed hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
                  >
                    <CardContent className="p-6 text-center">
                      <span className="text-5xl mb-4 block">{platform.icon}</span>
                      <h3 className="font-semibold text-lg mb-1 text-foreground">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{platform.description}</p>
                      <p className="text-xs text-primary mb-4">{platform.users} active users</p>
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Connect {platform.name}
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                <Card className="bg-muted/20 border-border border-dashed hover:border-primary/50 transition-all">
                  <CardContent className="p-6 text-center">
                    <div className="p-4 rounded-2xl bg-muted/50 mx-auto w-fit mb-4">
                      <Target className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">Request Platform</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Don't see your platform? Let us know!
                    </p>
                    <Button variant="outline" className="w-full">
                      Request Integration
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-4">
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      <CardTitle>Recent Activity</CardTitle>
                    </div>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                  <CardDescription>Latest updates from your connected platforms</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 border border-border/50 transition-all duration-200 hover:bg-muted/50"
                      >
                        <div
                          className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                            activity.positive
                              ? "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10"
                              : "bg-gradient-to-br from-red-500/20 to-red-600/10"
                          }`}
                        >
                          <activity.icon
                            className={`h-6 w-6 ${activity.positive ? "text-emerald-500" : "text-red-500"}`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {activity.platform}
                            </Badge>
                            <Badge
                              variant={activity.positive ? "default" : "destructive"}
                              className={`text-[10px] px-1.5 py-0 ${
                                activity.positive
                                  ? "bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30"
                                  : ""
                              }`}
                            >
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="font-medium text-foreground">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.detail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                          {activity.positive ? (
                            <ArrowUpRight className="h-4 w-4 text-emerald-500 ml-auto mt-1" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4 text-red-500 ml-auto mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Best Performing Platform */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Best Performing</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-primary/20">
                      <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                        <Music2 className="h-8 w-8 text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">TikTok</h3>
                        <p className="text-sm text-muted-foreground">Highest engagement rate this month</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">12.4%</p>
                        <p className="text-xs text-emerald-500 flex items-center justify-end gap-1">
                          <ArrowUpRight className="h-3 w-3" />
                          +5.8% growth
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      <h4 className="text-sm font-medium text-muted-foreground">Platform Ranking</h4>
                      {connectedPlatforms
                        .sort((a, b) => parseFloat(b.stats?.engagement || "0") - parseFloat(a.stats?.engagement || "0"))
                        .map((platform, index) => (
                          <div key={platform.id} className="flex items-center gap-3">
                            <span className="text-lg font-bold text-muted-foreground w-6">#{index + 1}</span>
                            <platform.icon
                              className="h-5 w-5"
                              style={{ color: getPlatformColor(platform.id) }}
                            />
                            <span className="flex-1 text-sm text-foreground">{platform.name}</span>
                            <span className="text-sm font-medium text-foreground">
                              {platform.stats?.engagement}
                            </span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendations */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">AI Recommendations</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      {
                        title: "Post more on TikTok",
                        desc: "Your TikTok engagement is 4x higher than other platforms. Consider increasing posting frequency.",
                        priority: "high",
                      },
                      {
                        title: "Revitalize Facebook strategy",
                        desc: "Facebook reach has declined 5%. Try video content to boost engagement.",
                        priority: "medium",
                      },
                      {
                        title: "Connect X (Twitter)",
                        desc: "Expand your reach by connecting your X account for cross-platform synergy.",
                        priority: "low",
                      },
                      {
                        title: "Optimal posting time",
                        desc: "Your audience is most active between 6-8 PM. Schedule posts accordingly.",
                        priority: "medium",
                      },
                    ].map((rec, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className="text-sm font-medium text-foreground">{rec.title}</h4>
                          <Badge
                            variant="outline"
                            className={`text-[10px] ${
                              rec.priority === "high"
                                ? "border-red-500/50 text-red-500"
                                : rec.priority === "medium"
                                ? "border-yellow-500/50 text-yellow-500"
                                : "border-muted-foreground/50"
                            }`}
                          >
                            {rec.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{rec.desc}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </TooltipProvider>
    </DashboardLayout>
  );
}
