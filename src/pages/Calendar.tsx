import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Youtube,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Clock,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Send,
  Globe,
  Mic,
  Music2,
  FileText,
  Image,
  Video,
} from "lucide-react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { toast } from "sonner";
import { DragDropImport } from "@/components/common/DragDropImport";
import { usePosts } from "@/hooks/usePosts";
import { useUJT } from "@/hooks/useUJT";
import { Post, PostType, PlatformType } from "@/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

const platformIcons: Record<string, React.ElementType> = {
  youtube: Youtube,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  website: Globe,
  podcast: Mic,
  tiktok: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
};

const platformNames: Record<string, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  twitter: "X",
  linkedin: "LinkedIn",
  website: "Novus Exchange",
  podcast: "Podcast",
  tiktok: "TikTok",
};

const platformColors: Record<string, string> = {
  youtube: "bg-red-500/20 text-red-500",
  instagram: "bg-pink-500/20 text-pink-500",
  facebook: "bg-blue-600/20 text-blue-600",
  twitter: "bg-foreground/20 text-foreground",
  linkedin: "bg-blue-500/20 text-blue-500",
  website: "bg-teal-500/20 text-teal-500",
  podcast: "bg-purple-500/20 text-purple-500",
  tiktok: "bg-foreground/20 text-foreground",
};

const availablePlatforms = ["youtube", "instagram", "facebook", "twitter", "linkedin", "website", "podcast", "tiktok"];

const postTypes: { value: PostType; label: string; icon: React.ElementType }[] = [
  { value: "text", label: "Text", icon: FileText },
  { value: "image", label: "Image", icon: Image },
  { value: "video", label: "Video", icon: Video },
  { value: "reel", label: "Reel", icon: Video },
  { value: "carousel", label: "Carousel", icon: Image },
  { value: "thread", label: "Thread", icon: FileText },
  { value: "article", label: "Article", icon: FileText },
];

const emptyPost = {
  title: "",
  content: "",
  platforms: [] as PlatformType[],
  scheduledDate: "",
  scheduledTime: "",
  status: "draft" as const,
  type: "text" as PostType,
};

export default function ContentCalendar() {
  const { posts, addPost, updatePost, deletePost, schedulePost, publishPost } = usePosts();
  const { processUJT } = useUJT();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "month">("week");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [newPost, setNewPost] = useState(emptyPost);

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getPostsForDate = (date: Date) => {
    return posts.filter((post) => {
      if (!post.scheduledAt) return false;
      const postDate = parseISO(post.scheduledAt);
      return isSameDay(postDate, date);
    });
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;

    if (!destination) return;

    // The droppableId is the ISO date string of the target day
    const targetDate = parseISO(destination.droppableId);
    
    // Find the post
    const post = posts.find(p => p.id === draggableId);
    if (!post) return;

    // Calculate new scheduled time (keep existing time or default to 9am)
    let newTime = "09:00";
    if (post.scheduledAt) {
      const currentDate = parseISO(post.scheduledAt);
      newTime = format(currentDate, "HH:mm");
    }

    const newScheduledAt = `${format(targetDate, "yyyy-MM-dd")}T${newTime}:00`;
    
    schedulePost.mutate({ id: draggableId, scheduledAt: newScheduledAt });
  };

  const todayPosts = getPostsForDate(selectedDate);

  const togglePlatform = (platformId: string, isNew: boolean) => {
    const platform = platformId as PlatformType;
    if (isNew) {
      setNewPost((prev) => ({
        ...prev,
        platforms: prev.platforms.includes(platform)
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform],
      }));
    } else if (editingPost) {
      // For editing, we just handle the local state update logic conceptually,
      // but editingPost structure is different (Post object).
      // Since Post object has platforms array of objects, we need a different approach if we want to toggle.
      // However, for simplicity in this refactor, we'll focus on creating new posts correctly first.
      // Editing existing posts' platforms would require mapping between PostPlatform[] and string[].
      // For now, let's assume editing platforms is limited or handled differently.
    }
  };

  const handleCreatePost = () => {
    if (!newPost.title || newPost.platforms.length === 0) {
      toast.error("Please enter a title and select at least one platform.");
      return;
    }

    let scheduledAt = null;
    if (newPost.scheduledDate && newPost.scheduledTime) {
      scheduledAt = `${newPost.scheduledDate}T${newPost.scheduledTime}:00`;
    }

    addPost.mutate({
      post: {
        title: newPost.title,
        content: newPost.content,
        type: newPost.type,
        status: scheduledAt ? "scheduled" : "draft",
        scheduled_at: scheduledAt,
      },
      platforms: newPost.platforms,
    }, {
      onSuccess: () => {
        setNewPost(emptyPost);
        setIsCreateDialogOpen(false);
      }
    });
  };

  const handleUpdatePost = () => {
    if (!editingPost) return;
    
    // Extract scheduled time if needed
    // This is a simplified update. Real app would handle complex platform updates.
    updatePost.mutate({
      id: editingPost.id,
      title: editingPost.title,
      content: editingPost.content,
      type: editingPost.type,
    });
    setEditingPost(null);
  };

  const handleDeletePost = (id: string) => {
    deletePost.mutate(id);
  };

  const handlePublishPost = (id: string) => {
    publishPost.mutate(id);
  };

  const openCreateWithDate = (date: Date) => {
    setNewPost({
      ...emptyPost,
      scheduledDate: format(date, "yyyy-MM-dd"),
    });
    setIsCreateDialogOpen(true);
  };

  const PostForm = ({ data, onChange, isNew }: { data: typeof emptyPost | Post; onChange: (data: any) => void; isNew: boolean }) => (
    <div className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          placeholder="Post title"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={data.content || ""}
          onChange={(e) => onChange({ ...data, content: e.target.value })}
          placeholder="Write your post content..."
          rows={4}
        />
      </div>
      {isNew && (
        <div className="space-y-2">
          <Label>Platforms</Label>
          <div className="flex flex-wrap gap-2">
            {availablePlatforms.map((platform) => {
              const Icon = platformIcons[platform];
              // Safe cast since we know availablePlatforms contains valid keys
              const isSelected = (data as typeof emptyPost).platforms.includes(platform as PlatformType);

              return (
                <div
                  key={platform}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-all ${
                    isSelected ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => togglePlatform(platform, isNew)}
                >
                  <Checkbox checked={isSelected} />
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{platformNames[platform]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Label>Content Type</Label>
        <Select value={data.type} onValueChange={(value: PostType) => onChange({ ...data, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {postTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <type.icon className="h-4 w-4" />
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isNew && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="date">Schedule Date</Label>
            <Input
              id="date"
              type="date"
              value={(data as typeof emptyPost).scheduledDate}
              onChange={(e) => onChange({ ...data, scheduledDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Schedule Time</Label>
            <Input
              id="time"
              type="time"
              value={(data as typeof emptyPost).scheduledTime}
              onChange={(e) => onChange({ ...data, scheduledTime: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );

  const handleImport = (data: any) => {
    if (data.version === "1.0" && Array.isArray(data.items)) {
      processUJT(data);
      return;
    }

    const items = Array.isArray(data) ? data : [data];
    items.forEach((item: any) => {
      if (item.title) {
        addPost.mutate({
          post: {
            title: item.title,
            content: item.content || "",
            type: item.type || "text",
            status: item.status || "draft",
            scheduled_at: item.scheduledAt || item.scheduled_at || null,
          },
          platforms: item.platforms || [],
        });
      }
    });
  };

  return (
    <DragDropImport onImport={handleImport} entityName="Post">
      <DashboardLayout>
        <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Content Calendar</h1>
            <p className="text-muted-foreground">Schedule and manage your posts across all platforms</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={view === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("week")}
                className="rounded-none"
              >
                Week
              </Button>
              <Button
                variant={view === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setView("month")}
                className="rounded-none"
              >
                Month
              </Button>
            </div>
            <Button className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              Schedule Post
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar Sidebar */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardContent className="p-3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="pointer-events-auto"
                />
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Scheduled</span>
                  <span className="font-medium text-foreground">
                    {posts.filter((p) => p.status === "scheduled").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium text-foreground">
                    {posts.filter((p) => p.status === "published").length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Drafts</span>
                  <span className="font-medium text-foreground">
                    {posts.filter((p) => p.status === "draft").length}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Calendar View */}
          <div className="lg:col-span-3 space-y-4">
            {view === "week" ? (
              <Card className="bg-card border-border">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{format(weekStart, "MMMM yyyy")}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedDate(addDays(selectedDate, -7))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSelectedDate(addDays(selectedDate, 7))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day) => {
                        const dayPosts = getPostsForDate(day);
                        const isToday = isSameDay(day, new Date());
                        const isSelected = isSameDay(day, selectedDate);
                        const dayId = day.toISOString();

                        return (
                          <Droppable key={dayId} droppableId={dayId}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className={`min-h-[160px] p-3 rounded-xl border cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/5 shadow-sm"
                                    : isToday
                                    ? "border-primary/50 bg-muted/50"
                                    : "border-border hover:bg-muted/30 hover:shadow-sm"
                                } ${snapshot.isDraggingOver ? "ring-2 ring-primary/30 bg-primary/10" : ""}`}
                                onClick={() => setSelectedDate(day)}
                                onDoubleClick={() => openCreateWithDate(day)}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <p className="text-xs font-medium text-muted-foreground uppercase">{format(day, "EEE")}</p>
                                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-sm font-semibold ${
                                    isToday ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground"
                                  }`}>
                                    {format(day, "d")}
                                  </div>
                                </div>
                                <div className="space-y-1.5">
                                  {dayPosts.map((post, index) => (
                                    <Draggable key={post.id} draggableId={post.id} index={index}>
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`text-xs px-2 py-1.5 rounded-md truncate cursor-grab active:cursor-grabbing border shadow-sm transition-all hover:scale-[1.02] ${
                                            post.status === "draft"
                                              ? "bg-muted text-muted-foreground border-transparent"
                                              : post.status === "published"
                                              ? "bg-success/10 text-success-foreground border-success/20"
                                              : "bg-background border-border"
                                          }`}
                                        >
                                          <div className="flex items-center gap-1.5">
                                            {post.type === "video" && <Video className="h-3 w-3 shrink-0 opacity-70" />}
                                            {post.type === "image" && <Image className="h-3 w-3 shrink-0 opacity-70" />}
                                            {post.type === "text" && <FileText className="h-3 w-3 shrink-0 opacity-70" />}
                                            <span className="truncate font-medium">{post.title}</span>
                                          </div>
                                        </div>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </div>
                              </div>
                            )}
                          </Droppable>
                        );
                      })}
                    </div>
                  </DragDropContext>
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-card border-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{format(selectedDate, "MMMM yyyy")}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))
                        }
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
                        Today
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))
                        }
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="w-full pointer-events-auto"
                  />
                </CardContent>
              </Card>
            )}

            {/* Selected Day Posts */}
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      {format(selectedDate, "EEEE, MMMM d")}
                    </CardTitle>
                    <CardDescription>
                      {todayPosts.length} post{todayPosts.length !== 1 ? "s" : ""} scheduled
                    </CardDescription>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => openCreateWithDate(selectedDate)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Post
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {todayPosts.length > 0 ? (
                  todayPosts.map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-[60px]">
                          <p className="text-sm font-medium text-foreground">
                            {post.scheduledAt ? format(parseISO(post.scheduledAt), "HH:mm") : "No time"}
                          </p>
                          <Badge
                            variant={post.status === "scheduled" ? "default" : post.status === "published" ? "outline" : "secondary"}
                            className={`text-xs ${post.status === "published" ? "border-success text-success" : ""}`}
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{post.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {post.platforms?.map((p) => {
                              const Icon = platformIcons[p.platform];
                              if (!Icon) return null;
                              return (
                                <div key={p.id} className={`p-1 rounded ${platformColors[p.platform] || ""}`}>
                                  <Icon className="h-3 w-3" />
                                </div>
                              );
                            })}
                            <Badge variant="outline" className="text-xs">
                              {post.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {post.status !== "published" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublishPost(post.id)}
                          >
                            <Send className="h-3 w-3 mr-1" />
                            Publish
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingPost(post)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePost(post.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No posts scheduled for this day</p>
                    <Button variant="outline" className="mt-4 gap-2" onClick={() => openCreateWithDate(selectedDate)}>
                      <Plus className="h-4 w-4" />
                      Schedule a Post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule New Post</DialogTitle>
              <DialogDescription>Create a new post to publish across your platforms.</DialogDescription>
            </DialogHeader>
            <PostForm data={newPost} onChange={setNewPost} isNew={true} />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                {newPost.scheduledDate && newPost.scheduledTime ? "Schedule Post" : "Save as Draft"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={!!editingPost} onOpenChange={(open) => !open && setEditingPost(null)}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>Update your scheduled post.</DialogDescription>
            </DialogHeader>
            {editingPost && <PostForm data={editingPost} onChange={setEditingPost} isNew={false} />}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingPost(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdatePost}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  </DragDropImport>
  );
}
