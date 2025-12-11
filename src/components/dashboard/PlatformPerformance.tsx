import { Globe, Podcast, Mail, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

const platforms = [
  {
    name: "Website",
    sessions: "39,730",
    change: 9.9,
    positive: true,
    icon: Globe,
    color: "bg-primary/20 text-primary",
  },
  {
    name: "Podcast",
    sessions: "3,389",
    change: 9.5,
    positive: false,
    icon: Podcast,
    color: "bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))]",
  },
  {
    name: "Newsletter",
    sessions: "19,239",
    change: 3.5,
    positive: true,
    icon: Mail,
    color: "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]",
  },
];

export function PlatformPerformance() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Platform Performance</h3>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          <button className="px-3 py-1 text-xs font-medium rounded bg-card text-foreground">
            Social
          </button>
          <button className="px-3 py-1 text-xs font-medium rounded text-muted-foreground hover:text-foreground">
            Web
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {platforms.map((platform) => (
          <div key={platform.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", platform.color)}>
                <platform.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{platform.name}</p>
                <p className="text-sm text-muted-foreground">{platform.sessions} Sessions</p>
              </div>
            </div>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              platform.positive ? "text-[hsl(var(--success))]" : "text-destructive"
            )}>
              {platform.positive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {platform.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
