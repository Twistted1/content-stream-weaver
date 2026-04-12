import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

const statusColors: Record<string, string> = {
  published: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]",
  scheduled: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning))]",
  draft: "bg-muted text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
  awaiting_review: "bg-primary/10 text-primary",
  generating: "bg-[hsl(var(--chart-2))]/10 text-[hsl(var(--chart-2))]",
};

export function RecentPosts() {
  const navigate = useNavigate();
  const { posts, isLoading } = usePosts();

  const recentPosts = (posts || []).slice(0, 5);

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Posts</h3>
        <Button variant="link" className="text-primary p-0 h-auto" onClick={() => navigate("/platforms")}>
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading...</p>
        ) : recentPosts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No posts yet. Create your first post to see it here.
          </p>
        ) : (
          recentPosts.map((post) => {
            const platforms = (post as any).platforms || [];
            const platformNames = platforms.map((p: any) => p.platform).join(", ");

            return (
              <div key={post.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-primary/10 shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {platformNames || "No platform"} · {post.type}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className={statusColors[post.status] || ""}>
                  {post.status.replace("_", " ")}
                </Badge>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
