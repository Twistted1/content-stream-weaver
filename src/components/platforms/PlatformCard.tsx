import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResponsiveContainer, BarChart, Bar } from "recharts";
import {
  CheckCircle2,
  Heart,
  TrendingUp,
  Clock,
  Settings,
  BarChart3,
  ExternalLink,
  Sparkles,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface PlatformData {
  id: string;
  name: string;
  icon: LucideIcon;
  colorClass: string;
  bgGradient: string;
  connected: boolean;
  username: string;
  followers: number;
  followersDisplay: string;
  posts: number;
  lastSync: string;
  status: string;
  stats: { views: string; engagement: string; shares: string };
  weeklyGrowth: number;
  topPost?: { likes: number; comments: number; title: string };
  weeklyData: { day: string; followers: number; views: number }[];
  schedule?: { pending: number; published: number };
  subPlatforms?: string[];
}

interface PlatformCardProps {
  platform: PlatformData;
  isSelected: boolean;
  onSelect: (id: string) => void;
  getPlatformColor: (id: string) => string;
}

export function PlatformCard({ platform, isSelected, onSelect, getPlatformColor }: PlatformCardProps) {
  return (
    <Card
      className={`bg-card border-border overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 cursor-pointer ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => onSelect(platform.id)}
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
  );
}
