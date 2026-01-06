import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { PostType } from "@/stores/useAppStore";
import { LucideIcon } from "lucide-react";

interface Platform {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface NewPost {
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
  type: PostType;
}

interface PostDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newPost: NewPost;
  onNewPostChange: (post: NewPost) => void;
  onCreatePost: () => void;
  connectedPlatforms: Platform[];
  getPlatformColor: (id: string) => string;
  togglePlatformSelection: (platformId: string) => void;
}

export function PostDialog({
  isOpen,
  onOpenChange,
  newPost,
  onNewPostChange,
  onCreatePost,
  connectedPlatforms,
  getPlatformColor,
  togglePlatformSelection,
}: PostDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Schedule a post to be published across your connected platforms.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter post title..."
              value={newPost.title}
              onChange={(e) => onNewPostChange({ ...newPost, title: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              placeholder="Write your post content..."
              rows={4}
              value={newPost.content}
              onChange={(e) => onNewPostChange({ ...newPost, content: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Content Type</Label>
            <Select
              value={newPost.type}
              onValueChange={(value: PostType) => 
                onNewPostChange({ ...newPost, type: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text Post</SelectItem>
                <SelectItem value="image">Image Post</SelectItem>
                <SelectItem value="video">Video Post</SelectItem>
                <SelectItem value="carousel">Carousel</SelectItem>
                <SelectItem value="reel">Reel</SelectItem>
                <SelectItem value="thread">Thread</SelectItem>
                <SelectItem value="article">Article</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {connectedPlatforms.map((platform) => (
                <div
                  key={platform.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                    newPost.platforms.includes(platform.id)
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => togglePlatformSelection(platform.id)}
                >
                  <Checkbox
                    checked={newPost.platforms.includes(platform.id)}
                    onCheckedChange={() => togglePlatformSelection(platform.id)}
                  />
                  <platform.icon
                    className="h-4 w-4"
                    style={{ color: getPlatformColor(platform.id) }}
                  />
                  <span className="text-sm">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Schedule Date</Label>
              <Input
                id="date"
                type="date"
                value={newPost.scheduledDate}
                onChange={(e) => onNewPostChange({ ...newPost, scheduledDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Schedule Time</Label>
              <Input
                id="time"
                type="time"
                value={newPost.scheduledTime}
                onChange={(e) => onNewPostChange({ ...newPost, scheduledTime: e.target.value })}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreatePost}>
            {newPost.scheduledDate && newPost.scheduledTime ? "Schedule Post" : "Save as Draft"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
