import React, { useState, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePosts } from "@/hooks/usePosts";
import { useUJT } from "@/hooks/useUJT";
import { DragDropImport } from "@/components/common/DragDropImport";
import { parseISO, format } from "date-fns";
import { NotificationsDropdown } from "@/components/header/NotificationsDropdown";
import { UserDropdown } from "@/components/header/UserDropdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  LayoutGrid, 
  LayoutList, 
  CalendarDays, 
  ListTodo,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  Bot
} from "lucide-react";

function getDaysInMonth(year: any, month: any) {
  const days = []; const firstDay = new Date(year, month, 1); const lastDay = new Date(year, month + 1, 0);
  for (let i = 0; i < firstDay.getDay(); i++) days.push(new Date(year, month, -firstDay.getDay() + i + 1));
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) days.push(new Date(year, month + 1, i));
  return days;
}

function getWeekDays(date: any) {
  const days = []; const start = new Date(date); start.setDate(date.getDate() - date.getDay());
  for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(d); }
  return days;
}

function formatDateKey(date: any) { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
function isSameDay(a: any, b: any) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function isToday(date: any) { return isSameDay(date, new Date()); }
function formatTime12(time: any) { const [h, m] = time.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; }

function getEventsForDay(events: any[], date: any) {
  return events.filter(e => e.date === formatDateKey(date)).sort((a, b) => {
    if (a.allDay && !b.allDay) return -1; if (!a.allDay && b.allDay) return 1;
    return (a.startTime || "").localeCompare(b.startTime || "");
  });
}

const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const CATEGORY_STYLES: any = {
  content:  { bg: "bg-violet-500/20", text: "text-violet-300", border: "border-violet-500/40", dot: "bg-violet-400", label: "Content",  icon: "🎬" },
  personal: { bg: "bg-emerald-500/20", text: "text-emerald-300", border: "border-emerald-500/40", dot: "bg-emerald-400", label: "Personal", icon: "🌿" },
  meeting:  { bg: "bg-blue-500/20", text: "text-blue-300", border: "border-blue-500/40", dot: "bg-blue-400", label: "Meeting",  icon: "👥" },
  deadline: { bg: "bg-red-500/20", text: "text-red-300", border: "border-red-500/40", dot: "bg-red-400", label: "Deadline", icon: "🚨" },
  publish:  { bg: "bg-amber-500/20", text: "text-amber-300", border: "border-amber-500/40", dot: "bg-amber-400", label: "Publish",  icon: "📤" },
  awaiting_review: { bg: "bg-orange-500/20", text: "text-orange-300", border: "border-orange-500/40", dot: "bg-orange-400", label: "Needs Review", icon: "⚠️", animate: "animate-pulse" },
};

const PLATFORM_STYLES: any = {
  youtube:   { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/40", dot: "bg-red-400", badgeBg: "bg-red-600", badgeText: "text-white", label: "YouTube", icon: "▶" },
  tiktok:    { bg: "bg-zinc-500/20", text: "text-zinc-300", border: "border-zinc-500/40", dot: "bg-zinc-400", badgeBg: "bg-black", badgeText: "text-white", label: "TikTok", icon: "♪" },
  instagram: { bg: "bg-pink-500/20", text: "text-pink-400", border: "border-pink-500/40", dot: "bg-pink-400", badgeBg: "bg-gradient-to-br from-purple-600 to-pink-500", badgeText: "text-white", label: "Instagram", icon: "◈" },
  twitter:   { bg: "bg-sky-500/20", text: "text-sky-400", border: "border-sky-500/40", dot: "bg-sky-400", badgeBg: "bg-sky-500", badgeText: "text-white", label: "Twitter/X", icon: "𝕏" },
  facebook:  { bg: "bg-blue-600/20", text: "text-blue-400", border: "border-blue-600/40", dot: "bg-blue-500", badgeBg: "bg-blue-600", badgeText: "text-white", label: "Facebook", icon: "f" },
  linkedin:  { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/40", dot: "bg-blue-400", badgeBg: "bg-blue-700", badgeText: "text-white", label: "LinkedIn", icon: "in" },
  website:   { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/40", dot: "bg-emerald-400", badgeBg: "bg-emerald-600", badgeText: "text-white", label: "Website", icon: "🌐" },
  rumble:    { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/40", dot: "bg-green-400", badgeBg: "bg-green-500", badgeText: "text-white", label: "Rumble", icon: "R" },
  none:      { bg: "bg-gray-500/20", text: "text-gray-300", border: "border-gray-500/40", dot: "bg-gray-400", badgeBg: "bg-gray-600", badgeText: "text-white", label: "", icon: "" },
};

const getStyle = (evt: any) => {
  if (evt.platform && evt.platform !== 'none' && PLATFORM_STYLES[evt.platform]) return PLATFORM_STYLES[evt.platform];
  return CATEGORY_STYLES[evt.category] || CATEGORY_STYLES['content'];
};

function StatPill({ icon, label, color }: any) {
  const colors: any = { violet: "bg-violet-500/10 text-violet-300 border-violet-500/20", amber: "bg-amber-500/10 text-amber-300 border-amber-500/20", red: "bg-red-500/10 text-red-300 border-red-500/20" };
  return <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${colors[color]}`}><span>{icon}</span>{label}</div>;
}

function MiniCalendar({ current, selected, events, onSelectDate, onChangeMonth }: any) {
  const days = getDaysInMonth(current.getFullYear(), current.getMonth());
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => onChangeMonth(-1)} className="w-7 h-7 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">‹</button>
        <span className="text-sm font-semibold text-white">{MONTH_NAMES[current.getMonth()]} {current.getFullYear()}</span>
        <button onClick={() => onChangeMonth(1)} className="w-7 h-7 rounded-lg text-gray-400 hover:text-white hover:bg-white/10">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">{DAY_NAMES.map(d => <div key={d} className="text-center text-[10px] text-gray-500 py-1">{d[0]}</div>)}</div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          const isSelected = isSameDay(day, selected); const today = isToday(day); const hasEvt = events.some((e:any)=>e.date===formatDateKey(day));
          return (
            <button key={i} onClick={() => onSelectDate(new Date(day))} className={`relative flex items-center justify-center w-7 h-7 mx-auto rounded-lg text-xs font-medium transition-all ${today ? "bg-violet-600 text-white font-bold" : isSelected ? "bg-white/15 text-white" : day.getMonth()===current.getMonth() ? "text-gray-300 hover:bg-white/10" : "text-gray-600 hover:bg-white/5"}`}>
              {day.getDate()}
              {hasEvt && !today && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-violet-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const FILTERS = [ 
  { value: "all", label: "All", icon: "◈" }, 
  { value: "awaiting_review", label: "Review Inbox", icon: "📥" },
  { value: "content", label: "Content", icon: "🎬" }, 
  { value: "publish", label: "Publish", icon: "📤" }, 
  { value: "meeting", label: "Meetings", icon: "👥" }, 
  { value: "deadline", label: "Deadlines", icon: "🚨" }, 
  { value: "personal", label: "Personal", icon: "🌿" } 
];

function Sidebar({ events, miniMonth, selectedDate, onSelectDate, onChangeMonth, onAddEvent, onClickEvent, categoryFilter, onFilterChange, onClose }: any) {
  const todayEvents = getEventsForDay(events, new Date());
  const completedToday = todayEvents.filter((e: any) => e.completed).length;
  const progress = todayEvents.length > 0 ? (completedToday / todayEvents.length) * 100 : 0;
  const upcoming = events.filter((e: any) => { 
    const eDate = new Date(e.date + "T12:00:00"); 
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0); 
    const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 8); 
    return eDate >= tomorrow && eDate <= nextWeek; 
  }).sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <aside className="flex flex-col gap-4 overflow-y-auto pb-6 custom-scrollbar h-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 text-sm">◧</span>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Dashboard</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-500">×</button>
        )}
      </div>
      
      <button onClick={onAddEvent} className="w-full flex justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm shadow-lg shadow-primary/20 transition-all active:scale-95">
        + New Event
      </button>

      <MiniCalendar current={miniMonth} selected={selectedDate} events={events} onSelectDate={onSelectDate} onChangeMonth={onChangeMonth} />

      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-3">
        <h3 className="text-[10px] font-bold text-blue-400 uppercase mb-3">Filter</h3>
        <div className="space-y-1">
          {FILTERS.map(f => {
            const active = categoryFilter === f.value; 
            const style = f.value !== "all" ? CATEGORY_STYLES[f.value] : null; 
            const count = f.value === "all" ? events.length : events.filter((e: any) => e.category === f.value).length;
            return (
              <button 
                key={f.value} 
                onClick={() => onFilterChange(f.value)} 
                className={`w-full flex justify-between px-3 py-2 rounded-lg text-xs transition-colors ${active ? (style ? `${style.bg} ${style.text}` : "bg-blue-600 text-white") : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
              >
                <span className="flex gap-2"><span>{f.icon}</span>{f.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${active ? "bg-black/20" : "bg-white/5 text-gray-500"}`}>
                  {f.value === "all" ? events.length : events.filter((e: any) => e.status === f.value || e.category === f.value).length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-[10px] font-bold text-blue-400 uppercase mb-3">Today's Agenda</h3>
        {todayEvents.length > 0 && <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-3"><div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` } as React.CSSProperties} /></div>}
        {todayEvents.length === 0 ? <p className="text-xs text-center py-4 text-gray-500">No events today 🎉</p> : (
          <div className="space-y-2">
            {todayEvents.map((evt: any) => {
              const s = getStyle(evt); 
              const p = PLATFORM_STYLES[evt.platform] || PLATFORM_STYLES['none'];
              return (
                <div key={evt.id} className={`flex gap-3 p-2.5 rounded-xl border cursor-pointer hover:border-white/20 transition-all ${evt.completed ? "opacity-50" : ""} ${s.bg} ${s.border}`} onClick={() => onClickEvent(evt)}>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-semibold truncate ${evt.completed ? "line-through" : s.text}`}>{evt.title}</p>
                    {evt.startTime && <p className="text-[10px] text-gray-500 mt-1">{formatTime12(evt.startTime)}</p>}
                    {evt.platform && evt.platform !== 'none' && <span className={`inline-block text-[9px] px-2 py-0.5 rounded mt-2 font-bold uppercase tracking-tighter ${p.badgeBg} ${p.badgeText}`}>{p.label}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4">
        <h3 className="text-[10px] font-bold text-blue-400 uppercase mb-3">Coming Up</h3>
        <div className="space-y-3">
          {upcoming.map((evt: any) => {
            const s = getStyle(evt); 
            const evtDate = new Date(evt.date + "T12:00:00");
            return (
              <div key={evt.id} className="flex items-center gap-3 cursor-pointer group" onClick={() => onClickEvent(evt)}>
                <div className={`w-9 h-9 flex-shrink-0 flex flex-col items-center justify-center rounded-xl ${s.bg} border ${s.border}`}>
                  <span className="text-[8px] font-bold text-gray-400 uppercase leading-tight">{evtDate.toLocaleDateString("en-US", { weekday: "short" })}</span>
                  <span className={`text-xs font-black ${s.text} leading-tight`}>{evtDate.getDate()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-200 truncate group-hover:text-blue-300 transition-colors uppercase tracking-tight">{evt.title}</p>
                  <p className="text-[10px] text-gray-500">{evt.startTime ? formatTime12(evt.startTime) : "All day"} · {s.label}</p>
                </div>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
              </div>
            );
          })}
          {upcoming.length === 0 && <p className="text-xs text-center text-gray-600">Nothing soon</p>}
        </div>
      </div>
      
      <div className="mt-auto bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <span className="text-xl">✨</span>
          <div>
            <p className="text-[11px] font-bold text-blue-300 uppercase mb-1">Smart Tip</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              Batching your tasks can save up to 40% of your production time.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function MonthView({ current, events, categoryFilter, onClickDay, onClickEvent }: any) {
  const days = getDaysInMonth(current.getFullYear(), current.getMonth());
  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-[#020617]">
      <div className="grid grid-cols-7 border-b border-white/10 text-center text-[10px] font-bold text-blue-400 uppercase tracking-widest py-4 sticky top-0 bg-[#0a0e1a] z-10">
        {DAY_NAMES.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="flex-1 grid grid-cols-7 border-l border-white/5">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(events, day).filter((e: any) => categoryFilter === 'all' || e.category === categoryFilter);
          const isCurrentMonth = day.getMonth() === current.getMonth();
          const today = isToday(day);
          
          return (
            <div 
              key={i} 
              onClick={() => onClickDay(new Date(day))} 
              className={`min-h-[140px] p-2 border-r border-b border-white/5 cursor-pointer hover:bg-blue-600/5 transition-colors relative group ${!isCurrentMonth ? "bg-black/20 opacity-40" : ""} ${today ? "bg-blue-600/5" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-black rounded-lg w-7 h-7 flex items-center justify-center transition-all ${today ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40" : isCurrentMonth ? "text-gray-300 group-hover:text-blue-200" : "text-gray-600"}`}>
                  {day.getDate()}
                </span>
                {dayEvents.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400/50" />}
              </div>
              <div className="space-y-1 overflow-hidden">
                {dayEvents.slice(0, 4).map((evt: any) => {
                  const s = getStyle(evt);
                  const isReview = evt.status === 'awaiting_review';
                  return (
                    <div 
                      key={evt.id} 
                      onClick={(e) => { e.stopPropagation(); onClickEvent(evt); }} 
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold truncate transition-all hover:scale-[1.02] active:scale-95 border ${s.bg} ${s.text} ${s.border} ${isReview ? 'animate-pulse ring-1 ring-orange-500/50' : ''}`}
                    >
                      {isReview && <span className="mr-1">⚠️</span>}
                      {evt.title}
                    </div>
                  );
                })}
                {dayEvents.length > 4 && (
                  <div className="min-h-[400px] text-[9px] text-gray-500 font-bold pl-2">+{dayEvents.length - 4} more</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ current, events, onClickEvent }: any) { 
  const weekDays = getWeekDays(current);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-background">
      <div className="grid grid-cols-7 border-b border-border text-center text-[10px] font-bold text-primary tracking-widest py-4 sticky top-0 bg-card z-10">
        {weekDays.map(d => (
          <div key={d.toISOString()} className={isToday(d) ? "text-primary" : "text-muted-foreground"}>
            <div className="uppercase">{DAY_NAMES[d.getDay()]}</div>
            <div className={`mt-1 text-lg font-black ${isToday(d) ? "text-primary" : "text-foreground"}`}>{d.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 border-l border-border min-h-[600px]">
        {weekDays.map((day, i) => {
          const dayEvents = getEventsForDay(events, day);
          return (
            <div key={i} className="min-h-[140px] p-2 border-r border-b border-border hover:bg-primary/5 transition-colors relative group">
              <div className="space-y-1">
                {dayEvents.map((evt: any) => {
                  const s = getStyle(evt);
                  return (
                    <div 
                      key={evt.id} 
                      onClick={() => onClickEvent(evt)}
                      className={`px-2 py-1.5 rounded-lg text-[10px] font-bold border ${s.bg} ${s.text} ${s.border} cursor-pointer hover:scale-[1.02] transition-transform`}
                    >
                      {evt.startTime && <span className="mr-1 opacity-70">{evt.startTime}</span>}
                      {evt.title}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DayView({ current, events, onClickEvent }: any) { 
  const dayEvents = getEventsForDay(events, current);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar bg-background p-6">
      <div className="max-w-3xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h2 className="text-3xl font-black text-foreground tracking-tighter">{format(current, "EEEE, MMMM do")}</h2>
            <p className="text-muted-foreground font-medium">Schedule for today</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-primary/20">{format(current, "dd")}</span>
          </div>
        </div>

        <div className="space-y-4">
          {dayEvents.length > 0 ? dayEvents.map((evt: any) => {
            const s = getStyle(evt);
            return (
              <div 
                key={evt.id} 
                onClick={() => onClickEvent(evt)}
                className={`flex gap-6 p-6 rounded-2xl border ${s.bg} ${s.border} cursor-pointer hover:scale-[1.01] transition-transform shadow-sm`}
              >
                <div className="w-20 shrink-0 text-lg font-black text-muted-foreground/50 tabular-nums">
                  {evt.startTime || "All Day"}
                </div>
                <div>
                  <h3 className={`text-lg font-black ${s.text} tracking-tight`}>{evt.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{evt.description}</p>
                  {evt.platform && evt.platform !== 'none' && (
                    <Badge className="mt-4 uppercase text-[10px] font-black">{evt.platform}</Badge>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="py-20 text-center border-2 border-dashed border-border rounded-3xl">
              <p className="text-muted-foreground font-medium italic">No events scheduled for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AgendaView({ events, onClickEvent }: any) { 
  const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-12">
        {sortedEvents.length > 0 ? (
          Array.from(new Set(sortedEvents.map(e => e.date))).map(dateStr => {
            const dateObj = parseISO(dateStr);
            const dayEvts = sortedEvents.filter(e => e.date === dateStr);
            return (
              <div key={dateStr} className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-6">
                <div className="sticky top-0 h-fit py-2">
                  <div className="text-sm font-black text-primary uppercase tracking-widest">{format(dateObj, "MMMM")}</div>
                  <div className="text-3xl font-black text-foreground">{format(dateObj, "do")}</div>
                  <div className="text-xs font-bold text-muted-foreground uppercase">{format(dateObj, "EEEE")}</div>
                </div>
                <div className="space-y-3">
                  {dayEvts.map((evt: any) => {
                    const s = getStyle(evt);
                    return (
                      <div 
                        key={evt.id} 
                        onClick={() => onClickEvent(evt)}
                        className={`flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-primary/5 cursor-pointer transition-colors shadow-sm`}
                      >
                        <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                        <div className="w-16 text-xs font-bold text-muted-foreground/60 tabular-nums">{evt.startTime || "00:00"}</div>
                        <div className="flex-1 font-bold text-foreground truncate">{evt.title}</div>
                        {evt.platform && evt.platform !== 'none' && (
                          <div className="text-[10px] font-black text-muted-foreground bg-secondary px-2 py-0.5 rounded uppercase tracking-tighter">{evt.platform}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <p className="text-lg font-medium">Nothing on your agenda</p>
          </div>
        )}
      </div>
    </div>
  );
}

function EventModal({ event, defaultDate, onSave, onDelete, onApprove, onClose }: any) {
  const [title, setTitle] = useState(event?.title || ""); const [date, setDate] = useState(event?.date || (defaultDate ? formatDateKey(defaultDate) : formatDateKey(new Date()))); const [startTime, setStartTime] = useState(event?.startTime || "09:00"); const [endTime, setEndTime] = useState(event?.endTime || "10:00"); const [category, setCategory] = useState(event?.category || "content"); const [platform, setPlatform] = useState(event?.platform || "none"); const [description, setDescription] = useState(event?.description || "");
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || "");

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url); // In a full prod app this uploads to Supabase Storage and returns true URL
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#1a1d2e] border border-white/10 rounded-2xl shadow-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">{event ? "Edit Event" : "New Event"}</h2>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white mb-4" />
        <div className="flex gap-4 mb-4">
          <input type="date" title="Event Date" aria-label="Event Date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
          <input type="time" title="Start Time" aria-label="Start Time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white" />
        </div>
        <select title="Event Category" aria-label="Event Category" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white mb-4">
          <option value="content">Content</option><option value="meeting">Meeting</option><option value="publish">Publish</option><option value="reel">Reel</option><option value="post">Post</option><option value="blog">Blog</option><option value="articles">Articles</option>
        </select>
        
        {/* Visual Render of a Proper Post */}
        <div className="mb-4">
           {imageUrl ? (
             <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/10 group mb-2">
                <img src={imageUrl} alt="Post preview" className="w-full h-full object-cover" />
                <button onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 p-1.5 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
             </div>
           ) : (
             <label className="flex flex-col items-center justify-center w-full h-24 bg-white/5 border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/10 mb-2 transition-colors">
               <span className="text-xs text-gray-400">📷 Attach Media (Turn this into a visual post)</span>
               <input type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
             </label>
           )}
        </div>

        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Notes" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white mb-4" />
        
        {event?.status === 'awaiting_review' && (
          <div className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl animate-pulse">⚠️</span>
              <div>
                <p className="text-sm font-bold text-orange-400">Needs Approval</p>
                <p className="text-[10px] text-orange-300/70 uppercase">AI-generated content requires review</p>
              </div>
            </div>
            <button 
              onClick={() => { if (onApprove) onApprove(event.id); onClose(); }}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-black rounded-xl hover:scale-105 transition-transform shadow-lg shadow-orange-900/20"
            >
              🚀 APPROVE & SCHEDULE
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2">
          {event && onDelete && <button onClick={() => { onDelete(event.originalId || event.id); onClose(); }} className="px-4 py-2 text-red-400">Delete</button>}
          <button onClick={onClose} className="px-4 py-2 text-gray-400">Cancel</button>
          <button onClick={() => { onSave({ id: event?.id || `evt-${Date.now()}`, title, date, startTime, endTime, category, platform, description, imageUrl, status: event?.status }); onClose(); }} className="px-4 py-2 bg-violet-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}

export default function ContentCalendar() {
  const { posts, addPost, updatePost, deletePost, schedulePost } = usePosts();
  const { processUJT } = useUJT();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try { const json = JSON.parse(event.target?.result as string); if (json.version === "1.0") processUJT(json); } catch (err) { console.error("Failed to parse JSON", err); }
    };
    reader.readAsText(file);
    e.target.value = "";
  };
  
  const events = posts.map((post: any) => {
    let date = formatDateKey(new Date()); let startTime = "";
    if (post.scheduledAt) { const d = parseISO(post.scheduledAt); date = formatDateKey(d); startTime = format(d, "HH:mm"); }
    return { 
      id: post.id, 
      originalId: post.id, 
      title: post.title, 
      description: post.content, 
      date, 
      startTime, 
      category: post.status === "published" ? "publish" : post.status === "awaiting_review" ? "awaiting_review" : "content", 
      status: post.status,
      platform: post.platforms && post.platforms[0] ? post.platforms[0].platform.toLowerCase() : "none", 
      completed: post.status === "published", 
      allDay: !post.scheduledAt 
    };
  });

  const [current, setCurrent] = useState(new Date()); const [miniMonth, setMiniMonth] = useState(new Date()); const [selectedDate, setSelectedDate] = useState(new Date()); const [viewMode, setViewMode] = useState("month"); const [categoryFilter, setCategoryFilter] = useState("all"); const [searchQuery, setSearchQuery] = useState(""); const [sidebarOpen, setSidebarOpen] = useState(true); const [modalOpen, setModalOpen] = useState(false); const [editingEvent, setEditingEvent] = useState<any>(null); const [defaultDate, setDefaultDate] = useState<any>(undefined);

  const navigate = useCallback((dir: number) => { 
    const next = new Date(current); 
    if (viewMode === "month") next.setMonth(current.getMonth() + dir); 
    else if (viewMode === "week") next.setDate(current.getDate() + dir * 7); 
    else if (viewMode === "day") next.setDate(current.getDate() + dir); 
    setCurrent(next); 
  }, [current, viewMode]);

  const handleSaveEvent = (event: any) => {
    const scheduledAt = event.startTime ? `${event.date}T${event.startTime}:00` : `${event.date}T09:00:00`; 
    const isUpdating = !event.id.startsWith("evt-");
    if (isUpdating) { 
      updatePost.mutate({ id: event.id, title: event.title, content: event.description, status: event.status || "scheduled", type: "text" }); 
      if (event.status !== 'awaiting_review') schedulePost.mutate({ id: event.id, scheduledAt }); 
    } else { 
      addPost.mutate({ post: { title: event.title, content: event.description || "", type: "text", status: "scheduled", scheduled_at: scheduledAt }, platforms: [] }); 
    }
  };
  const handleDeleteEvent = (id: string) => deletePost.mutate(id);
  const handleApproveEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event) {
      const scheduledAt = event.startTime ? `${event.date}T${event.startTime}:00` : `${event.date}T09:00:00`;
      schedulePost.mutate({ id, scheduledAt });
    }
  };

  const filteredEvents = searchQuery.trim() 
    ? events.filter((e: any) => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.description || "").toLowerCase().includes(searchQuery.toLowerCase())) 
    : (categoryFilter === 'all' ? events : events.filter((e: any) => e.status === categoryFilter || e.category === categoryFilter));

  const todayCount = events.filter((e: any) => e.date === formatDateKey(new Date())).length;
  const publishCount = events.filter((e: any) => e.category === "publish" || e.status === "published").length;
  const reviewCount = events.filter((e: any) => e.status === "awaiting_review").length;
  const deadlineCount = events.filter((e: any) => e.category === "deadline").length;

  const headerLabel = (() => {
    if (viewMode === "month") return `${MONTH_NAMES[current.getMonth()]} ${current.getFullYear()}`;
    if (viewMode === "week") {
      const start = new Date(current); start.setDate(current.getDate() - current.getDay());
      const end = new Date(start); end.setDate(start.getDate() + 6);
      if (start.getMonth() === end.getMonth()) return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`;
      return `${MONTH_NAMES[start.getMonth()]} ${start.getDate()} – ${MONTH_NAMES[end.getMonth()]} ${end.getDate()}, ${start.getFullYear()}`;
    }
    if (viewMode === "day") return current.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    return `Agenda · ${MONTH_NAMES[current.getMonth()]} ${current.getFullYear()}`;
  })();

  return (
    <DashboardLayout hideHeader={true}>
      <DragDropImport onImport={(data) => { if (data.version === "1.0") processUJT(data); }} entityName="UJT">
        <div className="h-screen w-full bg-[#020617] text-white flex flex-col font-sans overflow-hidden">
          
          {/* Top Master Class Header - Unified Theme */}
          <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-border bg-card z-40">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(p => !p)} 
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${sidebarOpen ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-secondary border-border text-muted-foreground'}`}
              >
                ☰
              </button>
              <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-xl">📅</div>
              <div>
                <h1 className="text-lg font-black text-foreground leading-none tracking-tighter">Content Calendar</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-bold text-primary leading-none">MyFlow</span>
                  <span className="text-[10px] text-muted-foreground leading-none">Smart Calendar</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1 max-w-xl mx-12 relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 text-sm group-focus-within:text-blue-300 transition-colors">🔍</span>
              <input 
                aria-label="Search" 
                title="Search events" 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
                placeholder="Find anything on your timeline..." 
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all" 
              />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">✕</button>}
            </div>

            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] font-bold py-2.5 px-5 rounded-2xl transition-all shadow-xl shadow-primary/20 flex items-center gap-2 active:scale-95">
                <span>Import UJT</span>
                <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
              </label>
              
               <div className="hidden lg:flex items-center gap-3 px-4 border-l border-white/10 mr-4">
                  <StatPill icon="📅" label={`${todayCount} TODAY`} color="violet" />
                  <StatPill icon="📥" label={`${reviewCount} REVIEW`} color="amber" />
                  <StatPill icon="📤" label={`${publishCount} POSTS`} color="red" />
               </div>

               <div className="flex items-center gap-2 border-l border-white/10 pl-4">
                 <NotificationsDropdown />
                 <UserDropdown />
               </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {sidebarOpen && (
              <div className="w-[320px] bg-[#020617] border-r border-white/5 p-5 shrink-0 transition-all duration-500 ease-in-out">
                <Sidebar 
                  events={filteredEvents} 
                  miniMonth={miniMonth} 
                  selectedDate={selectedDate} 
                  onSelectDate={(d: any) => { setSelectedDate(d); setCurrent(d); }} 
                  onChangeMonth={(dir: any) => { const next = new Date(miniMonth); next.setMonth(miniMonth.getMonth() + dir); setMiniMonth(next); }} 
                  onAddEvent={() => { setEditingEvent(null); setDefaultDate(undefined); setModalOpen(true); }} 
                  onClickEvent={(evt: any) => { setEditingEvent(evt); setModalOpen(true); }} 
                  categoryFilter={categoryFilter} 
                  onFilterChange={setCategoryFilter}
                />
              </div>
            )}
            
            <div className="flex-1 flex flex-col overflow-hidden bg-[#020617]">
               {/* Calendar Grid Toolbar */}
               <div className="flex-shrink-0 flex items-center justify-between px-8 py-5 border-b border-border bg-card">
                 <div className="flex items-center gap-4">
                    <div className="flex bg-secondary rounded-xl p-1 border border-border">
                       <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-primary">‹</button>
                       <button onClick={() => { setCurrent(new Date()); setSelectedDate(new Date()); }} className={`px-5 rounded-lg text-xs font-bold tracking-tight transition-all ${isToday(current) ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>Today</button>
                       <button onClick={() => navigate(1)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-background transition-colors text-primary">›</button>
                    </div>
                    <h2 className="text-xl font-black text-foreground ml-2 tracking-tighter">{headerLabel}</h2>
                 </div>
                 
                 <div className="flex items-center gap-1 bg-secondary border border-border rounded-2xl p-1.5">
                    {['month', 'week', 'day', 'agenda'].map(m => (
                      <button 
                        key={m} 
                        onClick={() => setViewMode(m)} 
                        className={`px-5 py-2 rounded-xl text-[10px] font-bold tracking-wide transition-all ${viewMode === m ? "bg-primary text-primary-foreground shadow-lg" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                 </div>
               </div>
               
               <div className="flex-1 overflow-hidden flex flex-col">
                 {viewMode === "month" && <MonthView current={current} events={filteredEvents} categoryFilter={categoryFilter} onClickDay={(date: any) => { setSelectedDate(date); setDefaultDate(date); setEditingEvent(null); setModalOpen(true); }} onClickEvent={(evt: any) => { setEditingEvent(evt); setModalOpen(true); }} />}
                 {viewMode === "week" && <WeekView current={current} events={filteredEvents} onClickEvent={(evt: any) => { setEditingEvent(evt); setModalOpen(true); }} />}
                 {viewMode === "day" && <DayView current={current} events={filteredEvents} onClickEvent={(evt: any) => { setEditingEvent(evt); setModalOpen(true); }} />}
                 {viewMode === "agenda" && <AgendaView events={filteredEvents} onClickEvent={(evt: any) => { setEditingEvent(evt); setModalOpen(true); }} />}
               </div>
            </div>
          </div>
          {modalOpen && <EventModal event={editingEvent} defaultDate={defaultDate} onSave={handleSaveEvent} onDelete={handleDeleteEvent} onApprove={handleApproveEvent} onClose={() => { setModalOpen(false); setEditingEvent(null); }} />}
        </div>
      </DragDropImport>
    </DashboardLayout>
  );
}
