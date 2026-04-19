import React, { useState, useCallback, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePosts } from "@/hooks/usePosts";
import { useUJT } from "@/hooks/useUJT";
import { DragDropImport } from "@/components/common/DragDropImport";
import { parseISO, format, addMonths, subMonths, isSameDay, isSameMonth, isToday, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from "date-fns";
import { NotificationsDropdown } from "@/components/header/NotificationsDropdown";
import { UserDropdown } from "@/components/header/UserDropdown";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Search,
  Bell,
  Calendar as CalendarIcon, 
  Clapperboard, 
  Send, 
  Users, 
  AlarmClock, 
  Leaf,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  Youtube,
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Globe,
  MessageSquare,
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  Info,
  Menu,
  Bot
} from "lucide-react";
import { cn } from "@/lib/utils";

// --- Types & Constants ---

const CATEGORY_STYLES: any = {
  content:  { bg: "bg-[#a855f7]", text: "text-white", border: "border-[#c084fc]", dot: "bg-white", label: "Content",  icon: <Clapperboard className="w-3.5 h-3.5" /> },
  publish:  { bg: "bg-[#f59e0b]", text: "text-black", border: "border-[#fbbf24]", dot: "bg-black", label: "Publish",  icon: <Send className="w-3.5 h-3.5" /> },
  meeting:  { bg: "bg-[#3b82f6]", text: "text-white", border: "border-[#60a5fa]", dot: "bg-white", label: "Meetings",  icon: <Users className="w-3.5 h-3.5" /> },
  deadline: { bg: "bg-[#f43f5e]", text: "text-white", border: "border-[#fb7185]", dot: "bg-white", label: "Deadlines", icon: <AlarmClock className="w-3.5 h-3.5" /> },
  personal: { bg: "bg-[#10b981]", text: "text-white", border: "border-[#34d399]", dot: "bg-white", label: "Personal", icon: <Leaf className="w-3.5 h-3.5" /> },
};

const PLATFORM_STYLES: any = {
  youtube:   { bg: "bg-[#FF0000]", text: "text-white", label: "YouTube", icon: <Youtube className="w-3 h-3" /> },
  tiktok:    { bg: "bg-[#00f2ea]", text: "text-black", label: "TikTok", icon: <MessageSquare className="w-3 h-3" /> },
  instagram: { bg: "bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]", text: "text-white", label: "Instagram", icon: <Instagram className="w-3 h-3" /> },
  twitter:   { bg: "bg-[#1da1f2]", text: "text-white", label: "Twitter", icon: <Twitter className="w-3 h-3" /> },
  linkedin:  { bg: "bg-[#0077b5]", text: "text-white", label: "LinkedIn", icon: <Linkedin className="w-3 h-3" /> },
};

// --- Helper Functions ---

const formatTime12 = (time: string) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
};

// --- Components ---

function HeaderStat({ icon, count, label, color }: any) {
  const colorMap: any = {
    indigo: "bg-[#6366f1]/10 text-[#818cf8] border-white/5",
    amber: "bg-[#f59e0b]/10 text-[#fbbf24] border-white/5",
    rose: "bg-[#f43f5e]/10 text-[#fb7185] border-white/5"
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-bold tracking-tight ${colorMap[color] || colorMap.indigo}`}>
      <span>{icon}</span>
      <span className="flex items-center gap-1">
        <span className="text-white">{count}</span>
        <span className="opacity-70 font-medium lowercase">{label}</span>
      </span>
    </div>
  );
}

function MiniCalendar({ current, selected, events, onSelectDate, onChangeMonth }: any) {
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="bg-[#1e2235]/20 border border-white/5 rounded-3xl p-4 mb-6 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 px-2">
        <button title="Previous Month" onClick={() => onChangeMonth(-1)} className="text-gray-500 hover:text-white transition-colors"><ChevronLeft className="w-3.5 h-3.5" /></button>
        <span className="text-[11px] font-black text-white uppercase tracking-[0.05em]">{format(current, "MMMM yyyy")}</span>
        <button title="Next Month" onClick={() => onChangeMonth(1)} className="text-gray-500 hover:text-white transition-colors"><ChevronRight className="w-3.5 h-3.5" /></button>
      </div>
      <div className="grid grid-cols-7 text-center mb-1">
        {["s", "m", "t", "w", "t", "f", "s"].map((d, i) => (
          <div key={i} className="text-[9px] font-black text-gray-600 uppercase py-1">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const isSelected = isSameDay(day, selected);
          const inMonth = isSameMonth(day, monthStart);
          const hasEvent = events.some((e: any) => isSameDay(parseISO(e.date), day));
          const isCurrentDay = isToday(day);

          return (
            <button
              key={i}
              onClick={() => onSelectDate(day)}
              className={`relative flex items-center justify-center w-7 h-7 mx-auto rounded-full text-[10px] font-bold transition-all ${
                isCurrentDay 
                  ? "bg-[#6366f1] text-white shadow-[0_0_12px_rgba(99,102,241,0.5)]" 
                  : isSelected 
                    ? "bg-white/10 text-white" 
                    : inMonth 
                      ? "text-gray-400 hover:white hover:bg-white/5" 
                      : "text-gray-700 hover:bg-white/[0.02]"
              }`}
            >
              {format(day, "d")}
              {!isCurrentDay && hasEvent && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({ events, miniMonth, selectedDate, onSelectDate, onChangeMonth, categoryFilter, onFilterChange, isRetracted, onToggleRetraction }: any) {
  if (isRetracted) return null;

  const todayDate = new Date();
  const todayEvents = events.filter((e: any) => isSameDay(parseISO(e.date), todayDate));
  const doneToday = todayEvents.filter((e: any) => e.completed).length;
  
  const filters = [
    { value: "all", label: "All", icon: <Info className="w-3.5 h-3.5 rotate-45" />, count: events.length },
    { value: "content", label: "Content", icon: CATEGORY_STYLES.content.icon, count: events.filter((e: any) => e.category === "content").length },
    { value: "publish", label: "Publish", icon: CATEGORY_STYLES.publish.icon, count: events.filter((e: any) => e.category === "publish").length },
    { value: "meeting", label: "Meetings", icon: CATEGORY_STYLES.meeting.icon, count: events.filter((e: any) => e.category === "meeting").length },
    { value: "deadline", label: "Deadlines", icon: CATEGORY_STYLES.deadline.icon, count: events.filter((e: any) => e.category === "deadline").length },
    { value: "personal", label: "Personal", icon: CATEGORY_STYLES.personal.icon, count: events.filter((e: any) => e.category === "personal").length },
  ];

  return (
    <aside className="w-[320px] h-full bg-card border-r border-border flex flex-col relative z-20 shrink-0 shadow-2xl">
      <div className="p-6 border-b border-border bg-card/50 backdrop-blur-xl">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            onClick={onToggleRetraction}
            className="bg-muted border border-border transition-all h-10 w-10 flex items-center justify-center rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-2xl">
              <CalendarIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-xl font-black tracking-tighter text-foreground whitespace-nowrap">Content Calendar</h2>
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none text-left">Management</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-primary to-[#a855f7] hover:opacity-90 text-white font-black uppercase tracking-widest py-6 rounded-2xl shadow-xl shadow-primary/20 border-0 group">
          <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform" />
          New Event
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <MiniCalendar 
          current={miniMonth} 
          selected={selectedDate} 
          events={events} 
          onSelectDate={onSelectDate} 
          onChangeMonth={onChangeMonth} 
        />

        <div className="bg-card border border-border rounded-[32px] p-5 mb-8 shadow-sm">
          <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Filter by Type</h3>
          <div className="space-y-1">
            {filters.map(f => (
              <button
                key={f.value}
                onClick={() => onFilterChange(f.value)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all group ${
                  categoryFilter === f.value 
                    ? "bg-muted text-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={categoryFilter === f.value ? "text-foreground" : "text-muted-foreground"}>{f.icon}</span>
                  <span className="text-xs font-bold tracking-tight">{f.label}</span>
                </div>
                <span className={`text-[10px] font-black min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full ${categoryFilter === f.value ? "bg-background text-foreground" : "bg-background text-muted-foreground"}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-[32px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Today's Agenda</h3>
            <span className="text-[10px] font-black text-muted-foreground tabular-nums uppercase">{doneToday}/{todayEvents.length} done</span>
          </div>
          
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-6">
            <div 
              className="progress-bar-fill rounded-full" 
              style={{ "--progress": todayEvents.length > 0 ? `${(doneToday / todayEvents.length) * 100}%` : "0%" } as React.CSSProperties} 
            />
          </div>

          <div className="space-y-4">
            {todayEvents.length > 0 ? todayEvents.map((evt: any) => {
              const s = CATEGORY_STYLES[evt.category] || CATEGORY_STYLES.content;
              const p = PLATFORM_STYLES[evt.platform];
              
              return (
                <div 
                  key={evt.id} 
                  className={cn(
                    "p-4 rounded-[28px] border-2 transition-all cursor-pointer group relative shadow-xl",
                    s.bg,
                    s.text,
                    s.border,
                    "hover:scale-[1.02] hover:brightness-110 active:scale-[0.98]"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 shadow-inner",
                      evt.completed ? "bg-white/20 border-white" : "border-white/30"
                    )}>
                      {evt.completed && <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-black leading-tight tracking-tight">{evt.title}</p>
                      <p className="text-[10px] font-bold mt-1 tracking-tight uppercase opacity-80">
                        {evt.startTime} {evt.endTime ? `— ${evt.endTime}` : ""}
                      </p>
                    </div>
                  </div>
                  {p && (
                    <div className={cn(
                      "absolute top-4 right-4 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5",
                      p.bg,
                      p.text
                    )}>
                      {p.icon}
                      {p.label}
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="text-center py-6 opacity-20">
                <CalendarIcon className="w-6 h-6 mx-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}

function GridView({ current, events, categoryFilter, onClickDay }: any) {
  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background border-l border-border">
      <div className="flex-none grid grid-cols-7 bg-border gap-[1px] border-b border-border sticky top-0 z-20">
        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
          <div key={day} className="py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center bg-card/50 backdrop-blur-md">
            {day}
          </div>
        ))}
      </div>
      
      <div className="flex-1 grid grid-cols-7 grid-rows-5 overflow-y-auto custom-scrollbar bg-border gap-[1px]">
        {calendarDays.map((day, i) => {
          const dayEvents = events.filter((e: any) => isSameDay(parseISO(e.date), day));
          const filteredEvents = categoryFilter === 'all' ? dayEvents : dayEvents.filter((e: any) => e.category === categoryFilter);
          const isTodayDay = isToday(day);
          const inMonth = isSameMonth(day, monthStart);

          return (
            <div 
              key={i} 
              onClick={() => onClickDay(day)}
              className={cn(
                "min-h-[140px] p-2 transition-all group cursor-pointer relative overflow-hidden",
                inMonth ? "bg-background" : "bg-muted/30",
                isTodayDay ? "bg-primary/5" : ""
              )}
            >
              <div className="flex justify-between items-start mb-2 relative z-10">
                <span className={`text-[11px] font-black tabular-nums transition-all ${
                  isTodayDay ? "text-primary" : inMonth ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
                }`}>
                  {format(day, "d")}
                </span>
                {isTodayDay && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
                )}
              </div>

              <div className="space-y-1 relative z-10">
                {filteredEvents.slice(0, 4).map((evt: any) => {
                  const s = CATEGORY_STYLES[evt.category] || CATEGORY_STYLES.content;
                  return (
                    <div 
                      key={evt.id}
                      className={cn(
                        "px-2 py-1 rounded-lg text-[10px] font-black truncate transition-all border shadow-lg",
                        s.bg,
                        s.text,
                        s.border,
                        "hover:scale-[1.02] hover:brightness-110 flex items-center gap-1.5"
                      )}
                    >
                      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
                      {evt.title}
                    </div>
                  );
                })}
                {filteredEvents.length > 4 && (
                  <div className="text-[9px] font-black text-muted-foreground pl-2 uppercase tracking-tighter">
                    + {filteredEvents.length - 4} more
                  </div>
                )}
              </div>
              
              {isTodayDay && (
                <div className="absolute inset-0 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ContentCalendar() {
  const { posts } = usePosts();
  const { processUJT } = useUJT();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [miniMonth, setMiniMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>(() => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    return [
      { id: "1", title: "Team Sync Call", category: "meeting", platform: null, date: todayStr, startTime: "9:00 AM", endTime: "9:30 AM", completed: false },
      { id: "2", title: "Film Tech Review Video", category: "content", platform: "youtube", date: todayStr, startTime: "10:00 AM", endTime: "1:00 PM", completed: false },
      { id: "3", title: "Post Morning Short", category: "publish", platform: "tiktok", date: todayStr, startTime: "3:00 PM", endTime: "3:30 PM", completed: false },
    ];
  });
  const [viewMode, setViewMode] = useState("month");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarRetracted, setIsSidebarRetracted] = useState(false);

  const navigateMonth = (dir: number) => {
    setCurrentDate(dir > 0 ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  const mappedPosts = useMemo(() => {
    return posts.map((post: any) => {
      const scheduledAt = post.scheduledAt ? parseISO(post.scheduledAt) : new Date();
      return {
        id: post.id,
        title: post.title,
        date: format(scheduledAt, "yyyy-MM-dd"),
        startTime: format(scheduledAt, "h:mm a"),
        category: post.status === "published" ? "publish" : post.status === "awaiting_review" ? "deadline" : "content",
        platform: post.platforms?.[0]?.platform?.toLowerCase() || null,
        completed: post.status === "published",
        description: post.content
      };
    });
  }, [posts]);

  const allEvents = useMemo(() => [...events, ...mappedPosts], [events, mappedPosts]);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(e => {
      const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (e.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || e.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [allEvents, searchQuery, categoryFilter]);

  const stats = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return {
      today: allEvents.filter(e => e.date === today).length,
      posts: allEvents.filter(e => e.category === "publish").length,
      deadlines: allEvents.filter(e => e.category === "deadline").length
    };
  }, [allEvents]);

  return (
    <DashboardLayout noPadding>
      {!isSidebarRetracted && (
        <div className="absolute top-24 left-4 z-[60] lg:hidden">
          <Button variant="outline" size="icon" onClick={() => setIsSidebarRetracted(false)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}
      {isSidebarRetracted && (
        <div className="absolute top-24 left-6 z-[60]">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setIsSidebarRetracted(false)}
            className="rounded-full bg-card border-border hover:bg-muted shadow-lg"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <DragDropImport onImport={(data) => { if (data.version === "1.0") processUJT(data); }} entityName="UJT">
        <div className="flex h-screen bg-background overflow-hidden relative">
          <Sidebar 
            events={filteredEvents}
            miniMonth={miniMonth}
            selectedDate={selectedDate}
            onSelectDate={(d: any) => { setSelectedDate(d); setCurrentDate(d); }}
            onChangeMonth={(dir: any) => setMiniMonth(prev => (dir > 0 ? addMonths(prev, 1) : subMonths(prev, 1)))}
            categoryFilter={categoryFilter}
            onFilterChange={setCategoryFilter}
            isRetracted={isSidebarRetracted}
            onToggleRetraction={() => setIsSidebarRetracted(true)}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full bg-background relative overflow-hidden">
            {/* Calendar Toolbar */}
            <div className="h-20 border-b border-border bg-card/30 backdrop-blur-3xl flex items-center justify-between px-8 z-10">
              <div className="flex items-center gap-8">
                <div className="flex flex-col">
                  <h1 className="text-xl font-black tracking-tighter text-foreground flex items-center gap-3">
                    {format(currentDate, "MMMM yyyy")}
                    <div className="flex items-center gap-1 ml-4 bg-muted/50 p-1 rounded-xl">
                      <Button variant="ghost" size="icon" onClick={() => navigateMonth(-1)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => navigateMonth(1)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </h1>
                </div>

                <Button 
                  variant="outline"
                  onClick={() => setCurrentDate(new Date())}
                  className="bg-card border-border hover:bg-muted text-foreground h-10 px-6 rounded-xl font-bold uppercase text-[10px] tracking-widest"
                >
                  Today
                </Button>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-muted p-1 rounded-2xl border border-border shadow-inner">
                  {['MONTH', 'WEEK', 'DAY', 'AGENDA'].map((v) => (
                    <Button
                      key={v}
                      variant="ghost"
                      size="sm"
                      onClick={() => setViewMode(v.toLowerCase() as any)}
                      className={cn(
                        "px-6 h-9 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                        viewMode === v.toLowerCase() 
                          ? "bg-card text-primary shadow-lg shadow-black/20" 
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {v}
                    </Button>
                  ))}
                </div>

                <div className="h-8 w-[1px] bg-border mx-2" />
                
                <Button 
                  onClick={() => window.location.href = '/ai'}
                  className="bg-primary hover:opacity-90 text-white font-black uppercase tracking-widest px-6 h-10 rounded-xl shadow-lg shadow-primary/20 flex items-center gap-2 group"
                >
                  <Bot className="h-4 w-4 group-hover:animate-bounce" />
                  AI Generate
                </Button>
                
                <div className="flex items-center gap-2">
                  <HeaderStat icon={<Clock className="w-3.5 h-3.5" />} count={stats.today} label="today" color="indigo" />
                  <HeaderStat icon={<FileText className="w-3.5 h-3.5" />} count={stats.posts} label="posts" color="amber" />
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {viewMode === "month" && (
                <GridView 
                  current={currentDate} 
                  events={filteredEvents}
                  categoryFilter={categoryFilter}
                  onClickDay={(d: any) => { setSelectedDate(d); setViewMode("day"); }}
                />
              )}
              {viewMode !== "month" && (
                <div className="p-8 text-gray-500 text-center font-black uppercase tracking-widest opacity-20 pt-20">
                  {viewMode} view under maintenance
                </div>
              )}
            </div>
          </div>
        </div>
      </DragDropImport>
    </DashboardLayout>
  );
}
