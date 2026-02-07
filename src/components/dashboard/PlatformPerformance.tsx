import { useState } from "react";
import { Globe, Podcast, Mail, TrendingUp, TrendingDown, Instagram, Youtube, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

type PlatformCategory = "social" | "web";

interface PlatformItem {
  name: string;
  sessions: string;
  change: number;
  positive: boolean;
  icon: React.ElementType;
  color: string;
  category: PlatformCategory;
}

const platforms: PlatformItem[] = [
  {
    name: "Website",
    sessions: "39,730",
    change: 9.9,
    positive: true,
    icon: Globe,
    color: "bg-primary/20 text-primary",
    category: "web",
  },
  {
    name: "Podcast",
    sessions: "3,389",
    change: 9.5,
    positive: false,
    icon: Podcast,
    color: "bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))]",
    category: "web",
  },
  {
    name: "Newsletter",
    sessions: "19,239",
    change: 3.5,
    positive: true,
    icon: Mail,
    color: "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]",
    category: "web",
  },
  {
    name: "Instagram",
    sessions: "24,512",
    change: 12.3,
    positive: true,
    icon: Instagram,
    color: "bg-[hsl(var(--chart-5))]/20 text-[hsl(var(--chart-5))]",
    category: "social",
  },
  {
    name: "YouTube",
    sessions: "18,901",
    change: 5.7,
    positive: true,
    icon: Youtube,
    color: "bg-destructive/20 text-destructive",
    category: "social",
  },
  {
    name: "X (Twitter)",
    sessions: "8,432",
    change: 2.1,
    positive: false,
    icon: Twitter,
    color: "bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))]",
    category: "social",
  },
];

export function PlatformPerformance() {
  const [activeCategory, setActiveCategory] = useState<PlatformCategory>("social");

  const filtered = platforms.filter((p) => p.category === activeCategory);

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Platform Performance</h3>
        <div className="flex gap-1 bg-secondary rounded-lg p-1">
          {(["social", "web"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded transition-colors",
                activeCategory === cat
                  ? "bg-card text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {cat === "social" ? "Social" : "Web"}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((platform) => (
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
