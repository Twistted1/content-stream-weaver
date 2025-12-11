import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Zap,
  Clock,
  Share2,
  Mail,
  Bell,
  RefreshCw,
  Plus,
  Play,
  Pause,
  MoreHorizontal,
} from "lucide-react";

const automations = [
  {
    id: 1,
    name: "Auto-publish to all platforms",
    description: "Automatically publish scheduled content to YouTube, TikTok, Instagram, Facebook, X, and LinkedIn",
    trigger: "Scheduled Time",
    platforms: ["YouTube", "TikTok", "Instagram", "Facebook", "X", "LinkedIn"],
    status: "active",
    lastRun: "2 hours ago",
    runs: 156,
  },
  {
    id: 2,
    name: "Cross-post new blog articles",
    description: "When a new blog post is published, create social media posts for all platforms",
    trigger: "New Content",
    platforms: ["X", "LinkedIn", "Facebook"],
    status: "active",
    lastRun: "1 day ago",
    runs: 42,
  },
  {
    id: 3,
    name: "Weekly performance digest",
    description: "Send weekly email report with analytics from all connected platforms",
    trigger: "Weekly Schedule",
    platforms: ["Email"],
    status: "active",
    lastRun: "3 days ago",
    runs: 12,
  },
  {
    id: 4,
    name: "Engagement notifications",
    description: "Get notified when posts exceed engagement thresholds",
    trigger: "Engagement Threshold",
    platforms: ["Slack", "Email"],
    status: "paused",
    lastRun: "1 week ago",
    runs: 89,
  },
  {
    id: 5,
    name: "Content backup",
    description: "Automatically backup all published content to cloud storage",
    trigger: "Daily Schedule",
    platforms: ["Google Drive"],
    status: "active",
    lastRun: "12 hours ago",
    runs: 365,
  },
];

const quickStats = [
  { label: "Active Automations", value: "4", icon: Zap, color: "text-emerald-500" },
  { label: "Total Runs Today", value: "23", icon: RefreshCw, color: "text-blue-500" },
  { label: "Time Saved", value: "12h", icon: Clock, color: "text-purple-500" },
  { label: "Connected Apps", value: "8", icon: Share2, color: "text-orange-500" },
];

export default function Automation() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Automation</h1>
            <p className="text-muted-foreground">Automate your content workflows and save time</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Automation
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Automations List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Your Automations
            </CardTitle>
            <CardDescription>Manage and monitor your automated workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${automation.status === 'active' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                    {automation.status === 'active' ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-foreground">{automation.name}</h3>
                      <Badge variant={automation.status === 'active' ? 'default' : 'secondary'}>
                        {automation.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{automation.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Trigger: {automation.trigger}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Last run: {automation.lastRun}
                      </span>
                      <span className="flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" />
                        {automation.runs} runs
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex gap-1">
                    {automation.platforms.slice(0, 3).map((platform) => (
                      <Badge key={platform} variant="outline" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                    {automation.platforms.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{automation.platforms.length - 3}
                      </Badge>
                    )}
                  </div>
                  <Switch checked={automation.status === 'active'} />
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20 text-primary">
                <Share2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Cross-Platform Posting</h3>
                <p className="text-sm text-muted-foreground">Post to multiple platforms at once</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">Get alerts for important events</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20 text-primary">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Smart Scheduling</h3>
                <p className="text-sm text-muted-foreground">Optimal posting times by AI</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
