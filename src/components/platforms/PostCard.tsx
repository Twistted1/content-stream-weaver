import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Clock, Send, Edit, Trash2, MoreVertical, Image, Video, FileText, Globe } from "lucide-react";
import { ScheduledPost } from "@/stores/useAppStore";
import { LucideIcon } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface PostCardProps {
  post: ScheduledPost;
  platforms: Platform[];
  getPlatformColor: (id: string) => string;
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
  onPublish: (id: string) => void;
}

export function PostCard({ post, platforms, getPlatformColor, onEdit, onDelete, onPublish }: PostCardProps) {
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "image": return Image;
      case "video": return Video;
      case "carousel": return FileText;
      default: return FileText;
    }
  };

  const getPlatformIcon = (id: string) => {
    const platform = platforms.find(p => p.id === id);
    return platform?.icon || Globe;
  };

  const PostTypeIcon = getPostTypeIcon(post.type);

  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="p-2 rounded-lg bg-muted/50">
              <PostTypeIcon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-foreground truncate">{post.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{post.content}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {post.platforms.map((platformId) => {
                  const PlatformIcon = getPlatformIcon(platformId);
                  return (
                    <div
                      key={platformId}
                      className="p-1.5 rounded-md"
                      style={{ background: `${getPlatformColor(platformId)}20` }}
                    >
                      <PlatformIcon
                        className="h-3 w-3"
                        style={{ color: getPlatformColor(platformId) }}
                      />
                    </div>
                  );
                })}
                <Badge
                  variant={post.status === "published" ? "default" : post.status === "scheduled" ? "secondary" : "outline"}
                  className="text-[10px] ml-2"
                >
                  {post.status}
                </Badge>
                {post.scheduledDate && post.scheduledTime && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(`${post.scheduledDate}T${post.scheduledTime}`).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.status !== "published" && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                onClick={() => onPublish(post.id)}
              >
                <Send className="h-3 w-3" />
                Publish
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(post)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => onDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
