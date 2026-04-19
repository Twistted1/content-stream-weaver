import React, { useState, useCallback } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePosts } from "@/hooks/usePosts";
import { useUJT } from "@/hooks/useUJT";
import { DragDropImport } from "@/components/common/DragDropImport";
import { parseISO, format } from "date-fns";
import { NotificationsDropdown } from "@/components/header/NotificationsDropdown";
import { UserDropdown } from "@/components/header/UserDropdown";
import {
  ChevronLeft, ChevronRight, Plus, Search, Bell, CalendarDays, Send, AlarmClock,
  Clapperboard, Briefcase, Users as UsersIcon, Sprout, Diamond, Youtube, Music2, Twitter, Instagram, Facebook, Linkedin, Globe, Video,
} from "lucide-react";

/* ── helpers ────────────────────────────────────────────── */

function getDaysInMonth(year: number, month: number) {
  const days: Date[] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  for (let i = 0; i < firstDay.getDay(); i++) days.push(new Date(year, month, -firstDay.getDay() + i + 1));
  for (let i = 1; i <= lastDay.getDate(); i++) days.push(new Date(year, month, i));
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) days.push(new Date(year, month + 1, i));
  return days;
}

function getWeekDays(date: Date) {
  const days: Date[] = [];
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay());
  for (let i = 0; i < 7; i++) { const d = new Date(start); d.setDate(start.getDate() + i); days.push(d); }
  return days;
}

function fmtKey(d: Date) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function isSame(a: Date, b: Date) { return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
function isToday(d: Date) { return isSame(d, new Date()); }
function fmt12(t: string) { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`; }
function fmtHour(t: string) { const h = parseInt(t.split(":")[0]); return `${h % 12 || 12} ${h >= 12 ? "pm" : "am"}`; }

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
const DAYS_SHORT = ["S","M","T","W","T","F","S"];

/* ── category / platform config ─────────────────────────── */

type CatKey = "content" | "publish" | "meeting" | "deadline" | "personal" | "awaiting_review";

const CAT: Record<CatKey, { color: string; bg: string; border: string; label: string; Icon: any; iconBg: string; iconColor: string }> = {
  content:  { color: "text-violet-300",  bg: "bg-violet-500/25",  border: "border-violet-500/40", label: "Content",   Icon: Clapperboard, iconBg: "bg-violet-500/20",  iconColor: "text-violet-400" },
  publish:  { color: "text-amber-300",   bg: "bg-amber-500/25",   border: "border-amber-500/40", label: "Publish",   Icon: Briefcase,    iconBg: "bg-amber-500/20",   iconColor: "text-amber-400" },
  meeting:  { color: "text-blue-300",    bg: "bg-blue-500/30",    border: "border-blue-500/40",  label: "Meetings",  Icon: UsersIcon,    iconBg: "bg-blue-500/20",    iconColor: "text-blue-400" },
  deadline: { color: "text-red-300",     bg: "bg-red-500/25",     border: "border-red-500/40",   label: "Deadlines", Icon: AlarmClock,   iconBg: "bg-red-500/20",     iconColor: "text-red-400" },
  personal: { color: "text-emerald-300", bg: "bg-emerald-500/25", border: "border-emerald-500/40", label: "Personal", Icon: Sprout,      iconBg: "bg-emerald-500/20", iconColor: "text-emerald-400" },
  awaiting_review: { color: "text-orange-300", bg: "bg-orange-500/25", border: "border-orange-500/40", label: "Needs Review", Icon: AlarmClock, iconBg: "bg-orange-500/20", iconColor: "text-orange-400" },
};

const PLAT: Record<string, { bar: string; badge: string; badgeText: string; label: string; Icon: any }> = {
  youtube:   { bar: "bg-red-600/30",     badge: "bg-red-600",    badgeText: "text-white", label: "YouTube",   Icon: Youtube },
  tiktok:    { bar: "bg-zinc-600/40",    badge: "bg-black",      badgeText: "text-white", label: "TikTok",    Icon: Music2 },
  instagram: { bar: "bg-pink-600/30",    badge: "bg-gradient-to-br from-purple-600 to-pink-500", badgeText: "text-white", label: "Instagram", Icon: Instagram },
  twitter:   { bar: "bg-sky-600/30",     badge: "bg-sky-500",    badgeText: "text-white", label: "Twitter/X", Icon: Twitter },
  facebook:  { bar: "bg-blue-700/30",    badge: "bg-blue-600",   badgeText: "text-white", label: "Facebook",  Icon: Facebook },
  linkedin:  { bar: "bg-blue-800/30",    badge: "bg-blue-700",   badgeText: "text-white", label: "LinkedIn",  Icon: Linkedin },
  website:   { bar: "bg-emerald-600/30", badge: "bg-emerald-600",badgeText: "text-white", label: "Website",   Icon: Globe },
  rumble:    { bar: "bg-green-600/30",   badge: "bg-green-500",  badgeText: "text-white", label: "Rumble",    Icon: Video },
};

function getBarColor(evt: CalEvent) {
  if (evt.platform && evt.platform !== "none" && PLAT[evt.platform]) return PLAT[evt.platform].bar;
  const c = CAT[evt.category as CatKey];
  return c ? c.bg : "bg-violet-500/20";
}

function getCatStyle(evt: CalEvent) {
  return CAT[evt.category as CatKey] || CAT.content;
}

/* ── event type ──────────────────────────────────────────── */

interface CalEvent {
  id: string;
  originalId: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime?: string;
  category: string;
  status: string;
  platform: string;
  completed: boolean;
  allDay: boolean;
  imageUrl?: string;
}

function getEventsForDay(events: CalEvent[], day: Date) {
  return events.filter(e => e.date === fmtKey(day)).sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    return (a.startTime || "").localeCompare(b.startTime || "");
  });
}

/* ── filters ─────────────────────────────────────────────── */

const FILTERS: { value: string; label: string; cat?: CatKey }[] = [
  { value: "all",      label: "All" },
  { value: "content",  label: "Content",   cat: "content" },
  { value: "publish",  label: "Publish",   cat: "publish" },
  { value: "meeting",  label: "Meetings",  cat: "meeting" },
  { value: "deadline", label: "Deadlines", cat: "deadline" },
  { value: "personal", label: "Personal",  cat: "personal" },
];

/* ── mini calendar ───────────────────────────────────────── */

function MiniCal({ current, selected, events, onSelect, onNav }: { current: Date; selected: Date; events: CalEvent[]; onSelect: (d: Date) => void; onNav: (dir: number) => void }) {
  const days = getDaysInMonth(current.getFullYear(), current.getMonth());
  return (
    <div>
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={() => onNav(-1)} className="w-6 h-6 rounded-md text-gray-500 hover:text-gray-200 hover:bg-white/10 flex items-center justify-center text-sm">‹</button>
        <span className="text-xs font-bold text-gray-300 tracking-wide">{MONTHS[current.getMonth()].slice(0,3).toUpperCase()} {current.getFullYear()}</span>
        <button onClick={() => onNav(1)} className="w-6 h-6 rounded-md text-gray-500 hover:text-gray-200 hover:bg-white/10 flex items-center justify-center text-sm">›</button>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {DAYS_SHORT.map((d, i) => <div key={i} className="text-center text-[10px] text-gray-600 font-bold py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((day, i) => {
          const sel = isSame(day, selected);
          const today = isToday(day);
          const hasEvt = events.some(e => e.date === fmtKey(day));
          const inMonth = day.getMonth() === current.getMonth();
          return (
            <button
              key={i}
              onClick={() => onSelect(new Date(day))}
              className={`relative flex items-center justify-center w-7 h-7 mx-auto rounded-md text-xs font-semibold transition-all
                ${today ? "bg-white text-black font-black" : sel ? "bg-white/15 text-white" : inMonth ? "text-gray-400 hover:bg-white/8 hover:text-gray-200" : "text-gray-700"}`}
            >
              {day.getDate()}
              {hasEvt && !today && <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-violet-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── sidebar ─────────────────────────────────────────────── */

function CalSidebar({ events, miniMonth, selectedDate, onSelectDate, onNavMonth, onAddEvent, onClickEvent, filter, onFilter }: any) {
  const todayEvents = getEventsForDay(events, new Date());
  const done = todayEvents.filter((e: CalEvent) => e.completed).length;

  return (
    <aside className="flex flex-col gap-5 overflow-y-auto pb-6 h-full pr-1 custom-scrollbar">
      <MiniCal current={miniMonth} selected={selectedDate} events={events} onSelect={onSelectDate} onNav={onNavMonth} />

      {/* Filter by type */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3">
        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 px-1">Filter by Type</h3>
        <div className="space-y-1">
          {FILTERS.map(f => {
            const active = filter === f.value;
            const count = f.value === "all" ? events.length : events.filter((e: CalEvent) => e.category === f.value).length;
            const cat = f.cat ? CAT[f.cat] : null;
            return (
              <button
                key={f.value}
                onClick={() => onFilter(f.value)}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all
                  ${active ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}
              >
                <span className="flex items-center gap-2.5">
                  <span className={`w-6 h-6 flex items-center justify-center rounded-md ${cat ? cat.iconBg : "bg-white/10"}`}>
                    {cat ? <cat.Icon className={`w-3.5 h-3.5 ${cat.iconColor}`} /> : <Diamond className="w-3.5 h-3.5 text-violet-400" />}
                  </span>
                  {f.label}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-md font-black ${active ? "bg-white/15 text-gray-200" : "bg-white/5 text-gray-500"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's agenda */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-3">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Today's Agenda</h3>
          <span className="text-[10px] text-gray-600 font-bold">{done}/{todayEvents.length} done</span>
        </div>
        {todayEvents.length > 0 && (
          <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${todayEvents.length > 0 ? (done / todayEvents.length) * 100 : 0}%` }} />
          </div>
        )}
        <div className="space-y-2">
          {todayEvents.length === 0 && <p className="text-xs text-center py-6 text-gray-600">No events today 🎉</p>}
          {todayEvents.map((evt: CalEvent) => {
            const p = PLAT[evt.platform];
            const cat = CAT[evt.category as CatKey] || CAT.content;
            return (
              <div
                key={evt.id}
                onClick={() => onClickEvent(evt)}
                className={`relative rounded-xl overflow-hidden cursor-pointer group transition-all hover:scale-[1.02] active:scale-[0.98] ${cat.bg} border ${cat.border}`}
              >
                <div className="px-3.5 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${evt.completed ? "bg-primary border-primary" : "border-white/40"}`} />
                    <p className={`text-xs font-bold truncate ${evt.completed ? "line-through text-gray-500" : "text-white"}`}>{evt.title}</p>
                  </div>
                  {evt.startTime && (
                    <p className="text-[10px] text-white/60 ml-5 mb-1.5 font-medium">
                      {fmt12(evt.startTime)}{evt.endTime ? ` – ${fmt12(evt.endTime)}` : ""}
                    </p>
                  )}
                  {p && (
                    <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-tight ml-5 ${p.badge} ${p.badgeText}`}>
                      <p.Icon className="w-2.5 h-2.5" />
                      {p.label}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

/* ── month grid ──────────────────────────────────────────── */

function MonthGrid({ current, events, categoryFilter, onClickDay, onClickEvent, onDropEvent }: any) {
  const days = getDaysInMonth(current.getFullYear(), current.getMonth());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-7 text-center text-[10px] font-black text-gray-500 uppercase tracking-widest py-3 border-b border-white/5 sticky top-0 bg-[#0a0d1a] z-10">
        {DAYS.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="flex-1 grid grid-cols-7 border-l border-white/[0.03]">
        {days.map((day, i) => {
          const dayEvts = getEventsForDay(events, day).filter((e: CalEvent) => categoryFilter === "all" || e.category === categoryFilter);
          const inMonth = day.getMonth() === current.getMonth();
          const today = isToday(day);
          const dayKey = fmtKey(day);
          const isDropTarget = dragOverKey === dayKey;

          return (
            <div
              key={i}
              onClick={() => onClickDay(new Date(day))}
              onDragOver={(e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (dragOverKey !== dayKey) setDragOverKey(dayKey); }}
              onDragLeave={() => { if (dragOverKey === dayKey) setDragOverKey(null); }}
              onDrop={(e) => {
                e.preventDefault();
                const id = e.dataTransfer.getData("text/event-id");
                setDragOverKey(null);
                setDraggingId(null);
                if (id && onDropEvent) onDropEvent(id, new Date(day));
              }}
              className={`min-h-[130px] p-2 border-r border-b border-white/[0.03] cursor-pointer transition-colors group
                ${!inMonth ? "opacity-30" : ""}
                ${isDropTarget ? "bg-primary/15 ring-2 ring-inset ring-primary/60" : today ? "bg-primary/[0.03]" : "hover:bg-white/[0.02]"}`}
            >
              <div className="mb-1.5">
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-black
                  ${today ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30" : inMonth ? "text-gray-400 group-hover:text-gray-200" : "text-gray-700"}`}>
                  {day.getDate()}
                </span>
              </div>
              <div className="space-y-1">
                {dayEvts.slice(0, 3).map((evt: CalEvent) => {
                  const barColor = getBarColor(evt);
                  const p = PLAT[evt.platform];
                  const isReview = evt.status === "awaiting_review";
                  const isDragging = draggingId === evt.id;
                  return (
                    <div
                      key={evt.id}
                      draggable
                      onDragStart={(e) => {
                        e.stopPropagation();
                        e.dataTransfer.setData("text/event-id", evt.originalId || evt.id);
                        e.dataTransfer.effectAllowed = "move";
                        setDraggingId(evt.id);
                      }}
                      onDragEnd={() => { setDraggingId(null); setDragOverKey(null); }}
                      onClick={(e) => { e.stopPropagation(); onClickEvent(evt); }}
                      title="Drag to reschedule"
                      className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold truncate cursor-grab active:cursor-grabbing transition-all hover:brightness-125 ${barColor} ${isReview ? "animate-pulse ring-1 ring-orange-500/40" : ""} ${isDragging ? "opacity-40 scale-95" : ""}`}
                    >
                      {evt.startTime && <span className="text-white/50 font-semibold shrink-0">{fmtHour(evt.startTime)}</span>}
                      {p && <p.Icon className="w-3 h-3 text-white/70 shrink-0" />}
                      <span className="text-white/90 truncate">{evt.title}</span>
                    </div>
                  );
                })}
                {dayEvts.length > 3 && <div className="text-[9px] text-gray-600 font-bold pl-2">+{dayEvts.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── week view ───────────────────────────────────────────── */

function WeekView({ current, events, onClickEvent }: any) {
  const weekDays = getWeekDays(current);
  return (
    <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
      <div className="grid grid-cols-7 text-center py-3 border-b border-white/5 sticky top-0 bg-[#0a0d1a] z-10">
        {weekDays.map(d => (
          <div key={d.toISOString()} className={isToday(d) ? "text-primary" : "text-gray-500"}>
            <div className="text-[10px] font-black uppercase tracking-widest">{DAYS[d.getDay()]}</div>
            <div className={`mt-1 text-lg font-black ${isToday(d) ? "text-primary" : "text-gray-300"}`}>{d.getDate()}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 grid grid-cols-7 border-l border-white/[0.03] min-h-[600px]">
        {weekDays.map((day, i) => {
          const dayEvts = getEventsForDay(events, day);
          return (
            <div key={i} className="min-h-[140px] p-2 border-r border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
              <div className="space-y-1.5">
                {dayEvts.map((evt: CalEvent) => {
                  const barColor = getBarColor(evt);
                  const p = PLAT[evt.platform];
                  return (
                    <div
                      key={evt.id}
                      onClick={() => onClickEvent(evt)}
                      className={`px-2.5 py-2 rounded-xl text-[10px] font-bold cursor-pointer hover:brightness-125 transition-all ${barColor} border border-white/10`}
                    >
                      {evt.startTime && <span className="text-white/50 mr-1">{fmtHour(evt.startTime)}</span>}
                      <span className="text-white/90">{evt.title}</span>
                      {p && <span className={`block text-[9px] mt-1 px-1.5 py-0.5 rounded w-fit font-black uppercase ${p.badge} ${p.badgeText}`}>{p.label}</span>}
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

/* ── day view ────────────────────────────────────────────── */

function DayView({ current, events, onClickEvent }: any) {
  const dayEvts = getEventsForDay(events, current);
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-black text-white tracking-tighter">{format(current, "EEEE, MMMM do")}</h2>
            <p className="text-gray-500 text-sm font-medium">Schedule for the day</p>
          </div>
          <span className="text-4xl font-black text-primary/20">{format(current, "dd")}</span>
        </div>
        {dayEvts.length > 0 ? dayEvts.map((evt: CalEvent) => {
          const barColor = getBarColor(evt);
          const p = PLAT[evt.platform];
          return (
            <div
              key={evt.id}
              onClick={() => onClickEvent(evt)}
              className={`flex gap-6 p-5 rounded-2xl cursor-pointer hover:brightness-110 transition-all border border-white/10 ${barColor}`}
            >
              <div className="w-16 shrink-0 text-sm font-black text-white/40 tabular-nums">{evt.startTime ? fmt12(evt.startTime) : "All Day"}</div>
              <div className="flex-1">
                <h3 className="text-base font-black text-white tracking-tight">{evt.title}</h3>
                {evt.description && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{evt.description}</p>}
                {p && <span className={`inline-block text-[9px] mt-3 px-2 py-0.5 rounded font-black uppercase ${p.badge} ${p.badgeText}`}>{p.label}</span>}
              </div>
            </div>
          );
        }) : (
          <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <p className="text-gray-600 font-medium">No events for this day</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── agenda view ─────────────────────────────────────────── */

function AgendaView({ events, onClickEvent }: any) {
  const sorted = [...events].sort((a: CalEvent, b: CalEvent) => a.date.localeCompare(b.date));
  const dateGroups = Array.from(new Set(sorted.map(e => e.date)));
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {dateGroups.length > 0 ? dateGroups.map(dateStr => {
          const dateObj = parseISO(dateStr);
          const dayEvts = sorted.filter(e => e.date === dateStr);
          return (
            <div key={dateStr} className="grid grid-cols-[160px_1fr] gap-6">
              <div className="sticky top-0 h-fit pt-1">
                <div className="text-xs font-black text-primary uppercase tracking-widest">{format(dateObj, "MMMM")}</div>
                <div className="text-3xl font-black text-white">{format(dateObj, "do")}</div>
                <div className="text-[10px] font-bold text-gray-600 uppercase">{format(dateObj, "EEEE")}</div>
              </div>
              <div className="space-y-2">
                {dayEvts.map((evt: CalEvent) => {
                  const barColor = getBarColor(evt);
                  return (
                    <div
                      key={evt.id}
                      onClick={() => onClickEvent(evt)}
                      className={`flex items-center gap-4 p-4 rounded-xl border border-white/5 cursor-pointer hover:brightness-110 transition-all ${barColor}`}
                    >
                      <div className="w-14 text-xs font-bold text-white/40 tabular-nums">{evt.startTime || "00:00"}</div>
                      <div className="flex-1 font-bold text-white truncate">{evt.title}</div>
                      {evt.platform && evt.platform !== "none" && PLAT[evt.platform] && (
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${PLAT[evt.platform].badge} ${PLAT[evt.platform].badgeText}`}>
                          {PLAT[evt.platform].label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        }) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-600">
            <p className="text-lg font-medium">Nothing on your agenda</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── event modal ─────────────────────────────────────────── */

function EventModal({ event, defaultDate, onSave, onDelete, onApprove, onClose }: any) {
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(event?.date || (defaultDate ? fmtKey(defaultDate) : fmtKey(new Date())));
  const [startTime, setStartTime] = useState(event?.startTime || "09:00");
  const [category, setCategory] = useState(event?.category || "content");
  const [platform, setPlatform] = useState(event?.platform || "none");
  const [description, setDescription] = useState(event?.description || "");
  const [imageUrl, setImageUrl] = useState(event?.imageUrl || "");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
        <h2 className="text-lg font-black text-white">{event ? "Edit Event" : "New Event"}</h2>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Event title..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50" />
        <div className="flex gap-3">
          <input type="date" title="Date" aria-label="Date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white" />
          <input type="time" title="Time" aria-label="Time" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-32 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white" />
        </div>
        <div className="flex gap-3">
          <select title="Category" aria-label="Category" value={category} onChange={e => setCategory(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white">
            <option value="content">Content</option>
            <option value="meeting">Meeting</option>
            <option value="publish">Publish</option>
            <option value="deadline">Deadline</option>
            <option value="personal">Personal</option>
          </select>
          <select title="Platform" aria-label="Platform" value={platform} onChange={e => setPlatform(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white">
            <option value="none">No platform</option>
            {Object.keys(PLAT).map(k => <option key={k} value={k}>{PLAT[k].label}</option>)}
          </select>
        </div>
        
        {!imageUrl ? (
          <label className="flex flex-col items-center justify-center w-full h-20 bg-white/[0.02] border-2 border-dashed border-white/10 rounded-xl cursor-pointer hover:bg-white/5 transition-colors">
            <span className="text-xs text-gray-500">📷 Attach media</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setImageUrl(URL.createObjectURL(f)); }} />
          </label>
        ) : (
          <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/10 group">
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
            <button onClick={() => setImageUrl("")} className="absolute top-2 right-2 bg-black/60 hover:bg-red-500/80 p-1.5 rounded-lg text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        )}

        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Notes..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 resize-none" />

        {event?.status === "awaiting_review" && (
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl animate-pulse">⚠️</span>
              <div>
                <p className="text-sm font-bold text-orange-400">Needs Approval</p>
                <p className="text-[10px] text-orange-300/60">AI-generated content</p>
              </div>
            </div>
            <button
              onClick={() => { if (onApprove) onApprove(event.id); onClose(); }}
              className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-xs font-black rounded-xl hover:scale-105 transition-transform"
            >
              🚀 Approve
            </button>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          {event && onDelete && (
            <button onClick={() => { onDelete(event.originalId || event.id); onClose(); }} className="px-4 py-2 text-xs font-bold text-red-400 hover:text-red-300 transition-colors">Delete</button>
          )}
          <button onClick={onClose} className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors">Cancel</button>
          <button
            onClick={() => { onSave({ id: event?.id || `evt-${Date.now()}`, title, date, startTime, category, platform, description, imageUrl, status: event?.status }); onClose(); }}
            className="px-6 py-2 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:bg-primary/90 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── main calendar ───────────────────────────────────────── */

export default function ContentCalendar() {
  const { posts, addPost, updatePost, deletePost, schedulePost } = usePosts();
  const { processUJT } = useUJT();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try { const json = JSON.parse(ev.target?.result as string); if (json.version === "1.0") processUJT(json); } catch {}
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Map DB posts → calendar events
  const events: CalEvent[] = posts.map((post: any) => {
    let date = fmtKey(new Date());
    let startTime = "";
    if (post.scheduledAt) { const d = parseISO(post.scheduledAt); date = fmtKey(d); startTime = format(d, "HH:mm"); }
    return {
      id: post.id,
      originalId: post.id,
      title: post.title,
      description: post.content || "",
      date,
      startTime,
      category: post.status === "published" ? "publish" : post.status === "awaiting_review" ? "awaiting_review" : "content",
      status: post.status,
      platform: post.platforms?.[0]?.platform?.toLowerCase() || "none",
      completed: post.status === "published",
      allDay: !post.scheduledAt,
    };
  });

  const [current, setCurrent] = useState(new Date());
  const [miniMonth, setMiniMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalEvent | null>(null);
  const [defaultDate, setDefaultDate] = useState<Date | undefined>(undefined);

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
      if (event.status !== "awaiting_review") schedulePost.mutate({ id: event.id, scheduledAt });
    } else {
      addPost.mutate({ post: { title: event.title, content: event.description || "", type: "text", status: "scheduled", scheduled_at: scheduledAt }, platforms: [] });
    }
  };
  const handleDeleteEvent = (id: string) => deletePost.mutate(id);
  const handleApproveEvent = (id: string) => {
    const event = events.find(e => e.id === id);
    if (event) schedulePost.mutate({ id, scheduledAt: event.startTime ? `${event.date}T${event.startTime}:00` : `${event.date}T09:00:00` });
  };

  // Drag-and-drop reschedule: keep original time-of-day, change date only
  const handleDropReschedule = useCallback((postId: string, newDay: Date) => {
    const evt = events.find(e => (e.originalId || e.id) === postId);
    if (!evt || evt.date === fmtKey(newDay)) return;
    const time = evt.startTime || "09:00";
    schedulePost.mutate({ id: postId, scheduledAt: `${fmtKey(newDay)}T${time}:00` });
  }, [events, schedulePost]);

  const filtered = searchQuery.trim()
    ? events.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || e.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : categoryFilter === "all" ? events : events.filter(e => e.category === categoryFilter || e.status === categoryFilter);

  const todayCount = events.filter(e => e.date === fmtKey(new Date())).length;
  const publishCount = events.filter(e => e.category === "publish").length;
  const deadlineCount = events.filter(e => e.category === "deadline").length;

  const headerLabel = (() => {
    if (viewMode === "month") return `${MONTHS[current.getMonth()]} ${current.getFullYear()}`;
    if (viewMode === "week") {
      const start = new Date(current); start.setDate(current.getDate() - current.getDay());
      const end = new Date(start); end.setDate(start.getDate() + 6);
      return start.getMonth() === end.getMonth()
        ? `${MONTHS[start.getMonth()]} ${start.getDate()} – ${end.getDate()}, ${start.getFullYear()}`
        : `${MONTHS[start.getMonth()]} ${start.getDate()} – ${MONTHS[end.getMonth()]} ${end.getDate()}`;
    }
    if (viewMode === "day") return current.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
    return `Agenda · ${MONTHS[current.getMonth()]} ${current.getFullYear()}`;
  })();

  return (
    <DashboardLayout hideHeader>
      <DragDropImport onImport={(data) => { if (data.version === "1.0") processUJT(data); }} entityName="UJT">
        <div className="h-screen w-full bg-background text-foreground flex flex-col overflow-hidden">

          {/* Header */}
          <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(p => !p)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-sm transition-colors">
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-foreground leading-none tracking-tight uppercase">Content Calendar</h1>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-0.5">CONTENT HUB</p>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-8 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400 w-3.5 h-3.5" />
              <input
                aria-label="Search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search events, tasks, content..."
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-primary/40 transition-colors"
              />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white text-xs">✕</button>}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 mr-3">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400"><CalendarDays className="w-3 h-3" /> {todayCount} today</span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-[11px] font-bold text-amber-400"><Send className="w-3 h-3" /> {publishCount} posts</span>
                {deadlineCount > 0 && <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-[11px] font-bold text-red-400"><AlarmClock className="w-3 h-3" /> {deadlineCount} deadlines</span>}
              </div>
              <NotificationsDropdown />
              <UserDropdown />
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            {sidebarOpen && (
              <div className="w-[260px] bg-card border-r border-border p-4 shrink-0">
                <CalSidebar
                  events={filtered}
                  miniMonth={miniMonth}
                  selectedDate={selectedDate}
                  onSelectDate={(d: Date) => { setSelectedDate(d); setCurrent(d); }}
                  onNavMonth={(dir: number) => { const n = new Date(miniMonth); n.setMonth(miniMonth.getMonth() + dir); setMiniMonth(n); }}
                  onAddEvent={() => { setEditingEvent(null); setDefaultDate(undefined); setModalOpen(true); }}
                  onClickEvent={(evt: CalEvent) => { setEditingEvent(evt); setModalOpen(true); }}
                  filter={categoryFilter}
                  onFilter={setCategoryFilter}
                />
              </div>
            )}

            {/* Main grid area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Toolbar */}
              <div className="flex-shrink-0 flex items-center justify-between px-6 py-3 border-b border-border bg-card">
                <div className="flex items-center gap-3">
                  <div className="flex bg-white/[0.03] rounded-xl p-1 border border-white/[0.06]">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 text-sm">‹</button>
                    <button
                      onClick={() => { setCurrent(new Date()); setSelectedDate(new Date()); }}
                      className={`px-4 py-1 rounded-lg text-[10px] font-black tracking-wide transition-all ${isToday(current) ? "bg-primary text-primary-foreground" : "text-gray-500 hover:text-gray-200"}`}
                    >
                      Today
                    </button>
                    <button onClick={() => navigate(1)} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-gray-400 text-sm">›</button>
                  </div>
                  <h2 className="text-base font-black text-white tracking-tight">{headerLabel}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
                    {(["month", "week", "day", "agenda"] as const).map(m => (
                      <button
                        key={m}
                        onClick={() => setViewMode(m)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-bold tracking-wide transition-all ${viewMode === m ? "bg-primary text-primary-foreground" : "text-gray-500 hover:text-gray-200"}`}
                      >
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => { setEditingEvent(null); setDefaultDate(undefined); setModalOpen(true); }}
                    className="ml-2 w-8 h-8 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* View */}
              <div className="flex-1 overflow-hidden flex flex-col bg-background">
                {viewMode === "month" && <MonthGrid current={current} events={filtered} categoryFilter={categoryFilter} onClickDay={(d: Date) => { setSelectedDate(d); setDefaultDate(d); setEditingEvent(null); setModalOpen(true); }} onClickEvent={(evt: CalEvent) => { setEditingEvent(evt); setModalOpen(true); }} onDropEvent={handleDropReschedule} />}
                {viewMode === "week" && <WeekView current={current} events={filtered} onClickEvent={(evt: CalEvent) => { setEditingEvent(evt); setModalOpen(true); }} />}
                {viewMode === "day" && <DayView current={current} events={filtered} onClickEvent={(evt: CalEvent) => { setEditingEvent(evt); setModalOpen(true); }} />}
                {viewMode === "agenda" && <AgendaView events={filtered} onClickEvent={(evt: CalEvent) => { setEditingEvent(evt); setModalOpen(true); }} />}
              </div>
            </div>
          </div>

          {modalOpen && (
            <EventModal
              event={editingEvent}
              defaultDate={defaultDate}
              onSave={handleSaveEvent}
              onDelete={handleDeleteEvent}
              onApprove={handleApproveEvent}
              onClose={() => { setModalOpen(false); setEditingEvent(null); }}
            />
          )}
        </div>
      </DragDropImport>
    </DashboardLayout>
  );
}
