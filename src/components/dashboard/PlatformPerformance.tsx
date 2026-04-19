import { useMemo } from "react";
import { usePosts } from "@/hooks/usePosts";
import { cn } from "@/lib/utils";
import { Instagram, Youtube, Twitter, Globe, Linkedin, Facebook, Video, Mic } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const platformMeta: Record<string, { icon: React.ElementType; color: string; accent: string }> = {
  instagram: { icon: Instagram, color: "bg-pink-500/10 text-pink-500", accent: "bg-pink-500" },
  youtube: { icon: Youtube, color: "bg-red-500/10 text-red-500", accent: "bg-red-500" },
  twitter: { icon: Twitter, color: "bg-sky-400/10 text-sky-400", accent: "bg-sky-400" },
  website: { icon: Globe, color: "bg-primary/10 text-primary", accent: "bg-primary" },
  linkedin: { icon: Linkedin, color: "bg-blue-600/10 text-blue-600", accent: "bg-blue-600" },
  facebook: { icon: Facebook, color: "bg-blue-500/10 text-blue-500", accent: "bg-blue-500" },
  tiktok: { icon: Video, color: "bg-rose-500/10 text-rose-500", accent: "bg-rose-500" },
  podcast: { icon: Mic, color: "bg-purple-500/10 text-purple-500", accent: "bg-purple-500" },
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

  const maxCount = Math.max(...platforms.map(p => p.count), 1);

  return (
    <div className="bg-card/30 backdrop-blur-xl rounded-[2rem] p-8 border border-border/50 shadow-2xl">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black italic uppercase tracking-tighter text-foreground">Distribution</h3>
        <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">LIVE FEED</span>
      </div>

      <div className="space-y-6">
        {platforms.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/50 rounded-2xl bg-muted/5">
             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">
                No telemetry detected.
             </p>
          </div>
        ) : (
          platforms.map((platform) => {
            const Icon = platform.meta.icon;
            const percentage = (platform.count / maxCount) * 100;
            return (
              <div key={platform.key} className="space-y-3 group cursor-default">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border border-current opacity-70 group-hover:opacity-100 transition-opacity", platform.meta.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-black italic uppercase tracking-tighter text-sm text-foreground">{platform.name}</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">{platform.count} posts deployed</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-foreground opacity-40 group-hover:opacity-100 transition-opacity">{Math.round(percentage)}%</span>
                </div>
                <div className="relative h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                   <div 
                      className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-1000", platform.meta.accent)} 
                      style={{ width: `${percentage}%` }}
                   />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
