import { Youtube, Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    title: "Content Piece Title 23 for TikTok",
    platform: "TikTok",
    status: "Published",
    views: "7,324",
    icon: "🎵",
    color: "bg-[hsl(var(--tiktok))]/20",
  },
  {
    title: "Weekly Update - Instagram Reels",
    platform: "Instagram",
    status: "Published",
    views: "12,891",
    icon: Instagram,
    color: "bg-[hsl(var(--instagram))]/20",
  },
  {
    title: "Tutorial Series Part 5",
    platform: "YouTube",
    status: "Scheduled",
    views: "—",
    icon: Youtube,
    color: "bg-[hsl(var(--youtube))]/20",
  },
  {
    title: "Industry Insights Thread",
    platform: "X",
    status: "Draft",
    views: "—",
    icon: Twitter,
    color: "bg-[hsl(var(--twitter))]/20",
  },
];

export function RecentPosts() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Posts</h3>
        <Button variant="link" className="text-primary p-0 h-auto">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${post.color}`}>
                {typeof post.icon === "string" ? (
                  <span className="text-lg">{post.icon}</span>
                ) : (
                  <post.icon className="h-5 w-5 text-foreground" />
                )}
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{post.title}</p>
                <p className="text-xs text-muted-foreground">
                  {post.platform} · {post.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-foreground">{post.views}</p>
              <p className="text-xs text-muted-foreground">Views</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
