import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
} from "lucide-react";

const platforms = [
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "bg-red-500",
    connected: true,
    username: "@ContentCreator",
    followers: "125K",
    lastSync: "2 min ago",
    status: "active",
    stats: { views: "2.5M", engagement: "8.2%" },
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music2,
    color: "bg-black",
    connected: true,
    username: "@creator_hub",
    followers: "89K",
    lastSync: "5 min ago",
    status: "active",
    stats: { views: "5.1M", engagement: "12.4%" },
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400",
    connected: true,
    username: "@content.creator",
    followers: "67K",
    lastSync: "10 min ago",
    status: "active",
    stats: { views: "890K", engagement: "6.8%" },
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "bg-blue-600",
    connected: true,
    username: "Content Creator Page",
    followers: "45K",
    lastSync: "15 min ago",
    status: "active",
    stats: { views: "320K", engagement: "4.2%" },
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    color: "bg-black",
    connected: false,
    username: null,
    followers: null,
    lastSync: null,
    status: "disconnected",
    stats: null,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-blue-700",
    connected: true,
    username: "Content Creator",
    followers: "12K",
    lastSync: "1 hour ago",
    status: "active",
    stats: { views: "156K", engagement: "5.1%" },
  },
];

const totalStats = {
  totalFollowers: "338K",
  totalViews: "8.9M",
  avgEngagement: "7.3%",
  connectedPlatforms: 5,
};

export default function Platforms() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Platforms</h1>
            <p className="text-muted-foreground">Manage your connected social media accounts</p>
          </div>
          <Button variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Sync All
          </Button>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Followers</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalFollowers}</p>
                </div>
                <div className="p-3 rounded-lg bg-primary/20 text-primary">
                  <Users className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.totalViews}</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/20 text-blue-500">
                  <Eye className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Engagement</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.avgEngagement}</p>
                </div>
                <div className="p-3 rounded-lg bg-pink-500/20 text-pink-500">
                  <Heart className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Connected</p>
                  <p className="text-2xl font-bold text-foreground">{totalStats.connectedPlatforms}/6</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/20 text-emerald-500">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className={`bg-card border-border ${
                !platform.connected ? "opacity-75" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${platform.color}`}>
                      <platform.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{platform.name}</CardTitle>
                      {platform.username && (
                        <CardDescription className="text-xs">{platform.username}</CardDescription>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {platform.connected ? (
                      <Badge variant="default" className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Connected
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <XCircle className="h-3 w-3 mr-1" />
                        Disconnected
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {platform.connected && platform.stats ? (
                  <>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="p-2 rounded-lg bg-muted">
                        <p className="text-lg font-bold text-foreground">{platform.followers}</p>
                        <p className="text-xs text-muted-foreground">Followers</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted">
                        <p className="text-lg font-bold text-foreground">{platform.stats.views}</p>
                        <p className="text-xs text-muted-foreground">Views</p>
                      </div>
                      <div className="p-2 rounded-lg bg-muted">
                        <p className="text-lg font-bold text-foreground">{platform.stats.engagement}</p>
                        <p className="text-xs text-muted-foreground">Engagement</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last synced: {platform.lastSync}</span>
                      <Switch checked={platform.status === "active"} />
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
                  </>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Connect your {platform.name} account to start managing content
                    </p>
                    <Button className="w-full">Connect {platform.name}</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* API Keys Notice */}
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
      </div>
    </DashboardLayout>
  );
}
