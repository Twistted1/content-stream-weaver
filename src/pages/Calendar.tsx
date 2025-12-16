import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
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
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";

const platformIcons: Record<string, React.ElementType> = {
  YouTube: Youtube,
  Instagram: Instagram,
  Facebook: Facebook,
  X: Twitter,
  LinkedIn: Linkedin,
  TikTok: () => (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  ),
};

const platformColors: Record<string, string> = {
  YouTube: "bg-red-500/20 text-red-500",
  Instagram: "bg-pink-500/20 text-pink-500",
  Facebook: "bg-blue-600/20 text-blue-600",
  X: "bg-foreground/20 text-foreground",
  LinkedIn: "bg-blue-500/20 text-blue-500",
  TikTok: "bg-foreground/20 text-foreground",
};

const scheduledPosts = [
  {
    id: 1,
    title: "New product launch announcement",
    date: new Date(),
    time: "10:00 AM",
    platforms: ["YouTube", "Instagram", "Facebook"],
    status: "scheduled",
    type: "video",
  },
  {
    id: 2,
    title: "Behind the scenes content",
    date: new Date(),
    time: "2:00 PM",
    platforms: ["Instagram", "TikTok"],
    status: "scheduled",
    type: "reel",
  },
  {
    id: 3,
    title: "Weekly tips thread",
    date: addDays(new Date(), 1),
    time: "9:00 AM",
    platforms: ["X", "LinkedIn"],
    status: "draft",
    type: "thread",
  },
  {
    id: 4,
    title: "Customer testimonial video",
    date: addDays(new Date(), 2),
    time: "11:00 AM",
    platforms: ["YouTube", "Facebook", "LinkedIn"],
    status: "scheduled",
    type: "video",
  },
  {
    id: 5,
    title: "Flash sale announcement",
    date: addDays(new Date(), 3),
    time: "8:00 AM",
    platforms: ["Instagram", "Facebook", "X"],
    status: "scheduled",
    type: "image",
  },
  {
    id: 6,
    title: "Industry news commentary",
    date: addDays(new Date(), 4),
    time: "3:00 PM",
    platforms: ["LinkedIn", "X"],
    status: "draft",
    type: "article",
  },
];

export default function ContentCalendar() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<"week" | "month">("week");

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => isSameDay(post.date, date));
  };

  const todayPosts = getPostsForDate(selectedDate);

  return (
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
            <Button className="gap-2">
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
                  <span className="font-medium text-foreground">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Published</span>
                  <span className="font-medium text-foreground">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Drafts</span>
                  <span className="font-medium text-foreground">4</span>
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
                    <CardTitle className="text-lg">
                      {format(weekStart, "MMMM yyyy")}
                    </CardTitle>
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
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day) => {
                      const posts = getPostsForDate(day);
                      const isToday = isSameDay(day, new Date());
                      const isSelected = isSameDay(day, selectedDate);

                      return (
                        <div
                          key={day.toISOString()}
                          className={`min-h-[120px] p-2 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : isToday
                              ? "border-primary/50 bg-muted/50"
                              : "border-border hover:bg-muted/30"
                          }`}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div className="text-center mb-2">
                            <p className="text-xs text-muted-foreground">{format(day, "EEE")}</p>
                            <p
                              className={`text-sm font-medium ${
                                isToday ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {format(day, "d")}
                            </p>
                          </div>
                          <div className="space-y-1">
                            {posts.slice(0, 3).map((post) => (
                              <div
                                key={post.id}
                                className={`text-xs p-1 rounded truncate ${
                                  post.status === "draft"
                                    ? "bg-muted text-muted-foreground"
                                    : "bg-primary/20 text-primary"
                                }`}
                              >
                                {post.title}
                              </div>
                            ))}
                            {posts.length > 3 && (
                              <p className="text-xs text-muted-foreground text-center">
                                +{posts.length - 3} more
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {format(selectedDate, "EEEE, MMMM d")}
                </CardTitle>
                <CardDescription>
                  {todayPosts.length} post{todayPosts.length !== 1 ? "s" : ""} scheduled
                </CardDescription>
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
                          <p className="text-sm font-medium text-foreground">{post.time}</p>
                          <Badge
                            variant={post.status === "scheduled" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {post.status}
                          </Badge>
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{post.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {post.platforms.map((platform) => {
                              const Icon = platformIcons[platform];
                              return (
                                <div
                                  key={platform}
                                  className={`p-1 rounded ${platformColors[platform]}`}
                                >
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No posts scheduled for this day</p>
                    <Button variant="outline" className="mt-4 gap-2">
                      <Plus className="h-4 w-4" />
                      Schedule a Post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
