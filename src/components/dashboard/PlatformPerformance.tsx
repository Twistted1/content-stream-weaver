import { useMemo } from "react";
import { usePosts } from "@/hooks/usePosts";
import { cn } from "@/lib/utils";
import { Instagram, Youtube, Twitter, Globe, Linkedin, Facebook } from "lucide-react";

const platformMeta: Record<string, { icon: React.ElementType; color: string }> = {
  instagram: { icon: Instagram, color: "bg-[hsl(var(--chart-5))]/20 text-[hsl(var(--chart-5))]" },
  youtube: { icon: Youtube, color: "bg-destructive/20 text-destructive" },
  twitter: { icon: Twitter, color: "bg-[hsl(var(--chart-1))]/20 text-[hsl(var(--chart-1))]" },
  website: { icon: Globe, color: "bg-primary/20 text-primary" },
  linkedin: { icon: Linkedin, color: "bg-[hsl(var(--chart-2))]/20 text-[hsl(var(--chart-2))]" },
  facebook: { icon: Facebook, color: "bg-[hsl(var(--warning))]/20 text-[hsl(var(--warning))]" },
  tiktok: { icon: Globe, color: "bg-[hsl(var(--chart-3))]/20 text-[hsl(var(--chart-3))]" },
  podcast: { icon: Globe, color: "bg-[hsl(var(--chart-4))]/20 text-[hsl(var(--chart-4))]" },
};

export function PlatformPerformance() {
  const { posts } = usePosts();

  const platforms = useMemo(() => {
    const counts = new Map<string, number>();
    (posts || []).forEach(p => {
      const pps = (p as any).platforms || [];
      pps.forEach((pp: any) => {
        counts.set(pp.platform, (counts.get(pp.platform) || 0) + 1);
      });
    });

    return Array.from(counts.entries())
      .map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        key: name,
        count,
        meta: platformMeta[name] || platformMeta.website,
      }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Platform Distribution</h3>
      </div>

      <div className="space-y-4">
        {platforms.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No platform data yet. Create posts to see distribution.
          </p>
        ) : (
          platforms.map((platform) => {
            const Icon = platform.meta.icon;
            return (
              <div key={platform.key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", platform.meta.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{platform.name}</p>
                    <p className="text-sm text-muted-foreground">{platform.count} posts</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
