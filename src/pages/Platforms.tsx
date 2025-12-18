import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  XCircle,
  Users,
  Eye,
  Heart,
  TrendingUp,
  Clock,
  Zap,
  Plus,
  Globe,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const platforms = [
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-500",
    connected: true,
    username: "@ContentCreator",
    followers: 125000,
    followersDisplay: "125K",
    posts: 342,
    lastSync: "2 min ago",
    status: "active",
    stats: { views: "2.5M", engagement: "8.2%" },
    weeklyGrowth: 3.2,
    topPost: { likes: 15600, comments: 1240 },
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    color: "bg-black dark:bg-zinc-800",
    connected: true,
    username: "@creator_hub",
    followers: 89000,
    followersDisplay: "89K",
    posts: 156,
    lastSync: "5 min ago",
    status: "active",
    stats: { views: "5.1M", engagement: "12.4%" },
    weeklyGrowth: 5.8,
    topPost: { likes: 45200, comments: 3100 },
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
    connected: true,
    username: "@content.creator",
    followers: 67000,
    followersDisplay: "67K",
    posts: 289,
    lastSync: "10 min ago",
    status: "active",
    stats: { views: "890K", engagement: "6.8%" },
    weeklyGrowth: 2.1,
    topPost: { likes: 8900, comments: 456 },
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    connected: true,
    username: "Content Creator Page",
    followers: 45000,
    followersDisplay: "45K",
    posts: 178,
    lastSync: "15 min ago",
    status: "active",
    stats: { views: "320K", engagement: "4.2%" },
    weeklyGrowth: -0.5,
    topPost: { likes: 2300, comments: 189 },
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "bg-black dark:bg-zinc-800",
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
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    connected: true,
    username: "Content Creator",
    followers: 12000,
    followersDisplay: "12K",
    posts: 67,
    lastSync: "1 hour ago",
    status: "active",
    stats: { views: "156K", engagement: "5.1%" },
    weeklyGrowth: 4.2,
    topPost: { likes: 890, comments: 67 },
  },
];

const totalStats = {
  totalFollowers: "338K",
  totalViews: "8.9M",
  avgEngagement: "7.3%",
  connectedPlatforms: 5,
  totalPosts: 1032,
  weeklyGrowth: 2.96,
};

const recentActivity = [
  { platform: "TikTok", icon: Music2, action: "Video went viral", detail: "45K+ likes in 24 hours", time: "2 hours ago", positive: true },
  { platform: "YouTube", icon: Youtube, action: "New milestone", detail: "Reached 125K subscribers", time: "5 hours ago", positive: true },
  { platform: "Instagram", icon: Instagram, action: "Story engagement spike", detail: "2,400 interactions", time: "1 day ago", positive: true },
  { platform: "Facebook", icon: Facebook, action: "Reach decreased", detail: "-5% compared to last week", time: "2 days ago", positive: false },
  { platform: "LinkedIn", icon: Linkedin, action: "Article featured", detail: "Added to LinkedIn News", time: "3 days ago", positive: true },
];

const availablePlatforms = [
  { id: "pinterest", name: "Pinterest", icon: "📌", description: "Visual discovery and bookmarking" },
  { id: "snapchat", name: "Snapchat", icon: "👻", description: "Stories and AR content" },
  { id: "threads", name: "Threads", icon: "🧵", description: "Text-based conversations" },
];

export default function Platforms() {
  const connectedPlatforms = platforms.filter(p => p.connected);
  const disconnectedPlatforms = platforms.filter(p => !p.connected);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Platforms</h1>
            <p className="text-muted-foreground">Manage your connected social media accounts</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync All
            </Button>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Platform
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Followers</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalStats.totalFollowers}</p>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +{totalStats.weeklyGrowth}% this week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Views</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalStats.totalViews}</p>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +12.4% this week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Avg Engagement</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalStats.avgEngagement}</p>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +0.3% this week
              </p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalStats.connectedPlatforms}/6</p>
              <p className="text-xs text-muted-foreground">platforms active</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Posts</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalStats.totalPosts.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">across all platforms</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Growth Rate</span>
              </div>
              <p className="text-2xl font-bold text-foreground">+{totalStats.weeklyGrowth}%</p>
              <p className="text-xs text-emerald-500">weekly average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connected" className="space-y-4">
          <TabsList>
            <TabsTrigger value="connected">Connected ({connectedPlatforms.length})</TabsTrigger>
            <TabsTrigger value="available">Available ({disconnectedPlatforms.length + availablePlatforms.length})</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="connected" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedPlatforms.map((platform) => (
                <Card key={platform.id} className="bg-card border-border overflow-hidden">
                  <div className={`h-1.5 ${platform.color}`} />
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${platform.color}`}>
                          <platform.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{platform.name}</CardTitle>
                          <CardDescription className="text-xs">{platform.username}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30 border-0">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 rounded-lg bg-muted">
                        <p className="text-lg font-bold text-foreground">{platform.followersDisplay}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted">
                        <p className="text-lg font-bold text-foreground">{platform.stats?.views}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted">
                        <p className="text-lg font-bold text-foreground">{platform.stats?.engagement}</p>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Weekly Growth</span>
                        <span className={platform.weeklyGrowth >= 0 ? "text-emerald-500" : "text-red-500"}>
                          {platform.weeklyGrowth >= 0 ? "+" : ""}{platform.weeklyGrowth}%
                        </span>
                      </div>
                      <Progress 
                        value={Math.min(Math.abs(platform.weeklyGrowth) * 10, 100)} 
                        className="h-2" 
                      />
                    </div>

                    {platform.topPost && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1">Top Performing Post</p>
                        <div className="flex gap-4 text-sm">
                          <span className="flex items-center gap-1 text-foreground">
                            <Heart className="h-3 w-3" />
                            {platform.topPost.likes.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1 text-foreground">
                            💬 {platform.topPost.comments.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {platform.lastSync}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={platform.status === "active"} />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <Settings className="h-3 w-3" />
                        Settings
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Open
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disconnectedPlatforms.map((platform) => (
                <Card key={platform.id} className="bg-card border-border border-dashed">
                  <CardContent className="p-6 text-center">
                    <div className={`p-3 rounded-xl ${platform.color} mx-auto w-fit mb-4`}>
                      <platform.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Connect your {platform.name} account to track performance
                    </p>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect {platform.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              {availablePlatforms.map((platform) => (
                <Card key={platform.id} className="bg-card border-border border-dashed">
                  <CardContent className="p-6 text-center">
                    <span className="text-4xl mb-4 block">{platform.icon}</span>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">{platform.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{platform.description}</p>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Connect {platform.name}
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Card className="bg-muted/30 border-border border-dashed">
                <CardContent className="p-6 text-center">
                  <Globe className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
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
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your connected platforms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        activity.positive ? "bg-emerald-500/20" : "bg-red-500/20"
                      }`}>
                        <activity.icon className={`h-5 w-5 ${
                          activity.positive ? "text-emerald-500" : "text-red-500"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{activity.platform}</Badge>
                          <span className="text-sm font-medium text-foreground">{activity.action}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{activity.detail}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50 border-border">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 rounded-lg bg-amber-500/20 text-amber-500">
                  <Settings className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground">API Configuration</h3>
                  <p className="text-sm text-muted-foreground">
                    Configure API keys and authentication for each platform in Settings → Integrations
                  </p>
                </div>
                <Button variant="outline">Configure</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
