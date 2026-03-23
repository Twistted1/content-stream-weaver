import React, { useState, useCallback, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { usePosts } from "@/hooks/usePosts";
import { useUJT } from "@/hooks/useUJT";
import { DragDropImport } from "@/components/common/DragDropImport";
import { parseISO, format } from "date-fns";

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

const FILTERS = [ { value: "all", label: "All", icon: "◈" }, { value: "content", label: "Content", icon: "🎬" }, { value: "publish", label: "Publish", icon: "📤" }, { value: "meeting", label: "Meetings", icon: "👥" }, { value: "deadline", label: "Deadlines", icon: "🚨" }, { value: "personal", label: "Personal", icon: "🌿" } ];

function Sidebar({ events, miniMonth, selectedDate, onSelectDate, onChangeMiniMonth, onAddEvent, onClickEvent, categoryFilter, onFilterChange, onClose }: any) {
  const todayEvents = getEventsForDay(events, new Date());
  const completedToday = todayEvents.filter((e: any) => e.completed).length;
  const progress = todayEvents.length > 0 ? (completedToday / todayEvents.length) * 100 : 0;
  const upcoming = events.filter((e: any) => { const eDate = new Date(e.date + "T12:00:00"); const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1); tomorrow.setHours(0, 0, 0, 0); const nextWeek = new Date(); nextWeek.setDate(nextWeek.getDate() + 8); return eDate >= tomorrow && eDate <= nextWeek; }).sort((a: any, b: any) => a.date.localeCompare(b.date)).slice(0, 5);

  return (
    <aside className="flex flex-col gap-3 overflow-y-auto pb-4 custom-scrollbar">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"><span className="text-violet-400 text-sm">◧</span><h2 className="text-xs font-semibold text-gray-400 uppercase">Panel</h2></div>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-500">×</button>
      </div>
      <button onClick={onAddEvent} className="w-full flex justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:scale-[1.02] transition-all">+ New Event</button>
      <MiniCalendar current={miniMonth} selected={selectedDate} events={events} onSelectDate={onSelectDate} onChangeMonth={onChangeMiniMonth} />
      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Filter</h3>
        <div className="space-y-0.5">
          {FILTERS.map(f => {
            const active = categoryFilter === f.value; const style = f.value !== "all" ? CATEGORY_STYLES[f.value] : null; const count = f.value === "all" ? events.length : events.filter((e: any) => e.category === f.value).length;
            return <button key={f.value} onClick={() => onFilterChange(f.value)} className={`w-full flex justify-between px-2.5 py-1.5 rounded-lg text-xs ${active ? (style ? `${style.bg} ${style.text}` : "bg-white/10 text-white") : "text-gray-400 hover:bg-white/5 hover:text-gray-200"}`}><span className="flex gap-2"><span>{f.icon}</span>{f.label}</span><span className={`text-[10px] px-1.5 py-0.5 rounded-md ${active ? "bg-black/20" : "bg-white/5 text-gray-500"}`}>{count}</span></button>;
          })}
        </div>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-xl p-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Today's Agenda</h3>
        {todayEvents.length > 0 && <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-2"><div className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 transition-all" style={{ width: `${progress}%` }} /></div>}
        {todayEvents.length === 0 ? <p className="text-xs text-center py-2 text-gray-600">No events today 🎉</p> : (
          <div className="space-y-1.5">
            {todayEvents.map((evt: any) => {
              const s = getStyle(evt); const p = PLATFORM_STYLES[evt.platform] || PLATFORM_STYLES['none'];
              return (
                <div key={evt.id} className={`flex gap-2.5 p-2 rounded-lg border cursor-pointer hover:border-white/20 ${evt.completed ? "opacity-50" : ""} ${s.bg} ${s.border}`} onClick={() => onClickEvent(evt)}>
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs font-medium truncate ${evt.completed ? "line-through" : s.text}`}>{evt.title}</p>
                    {evt.startTime && <p className="text-[10px] text-gray-500 mt-0.5">{formatTime12(evt.startTime)}</p>}
                    {evt.platform && evt.platform !== 'none' && <span className={`inline-block text-[9px] px-1.5 py-0.5 rounded mt-1 font-medium ${p.badgeBg} ${p.badgeText}`}>{p.label}</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {upcoming.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-xl p-3">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Coming Up</h3>
          <div className="space-y-1.5">
            {upcoming.map((evt: any) => {
              const s = getStyle(evt); const evtDate = new Date(evt.date + "T12:00:00");
              return (
                <div key={evt.id} className="flex items-center gap-2 cursor-pointer group" onClick={() => onClickEvent(evt)}>
                  <div className={`w-8 h-8 flex-shrink-0 flex flex-col items-center justify-center rounded-lg ${s.bg} border ${s.border}`}><span className="text-[8px] font-medium text-gray-400 leading-tight">{evtDate.toLocaleDateString("en-US", { weekday: "short" })}</span><span className={`text-xs font-bold ${s.text} leading-tight`}>{evtDate.getDate()}</span></div>
                  <div className="min-w-0 flex-1"><p className="text-xs font-medium text-gray-300 truncate group-hover:text-white transition-colors">{evt.title}</p><p className="text-[9px] text-gray-500">{evt.startTime ? formatTime12(evt.startTime) : "All day"} · {s.label}</p></div>
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-xl p-3">
        <div className="flex items-start gap-2"><span className="text-xl">✨</span><div><p className="text-[11px] font-semibold text-violet-300 mb-0.5">Smart Tip</p><p className="text-[10px] text-gray-400 leading-relaxed">You have {todayEvents.filter((e: any) => e.category === "content").length} content tasks today. Batch your filming sessions to save up to 40% more time.</p></div></div>
      </div>
    </aside>
  );
}

function MonthView({ current, events, categoryFilter, onClickDay, onClickEvent }: any) {
  const days = getDaysInMonth(current.getFullYear(), current.getMonth());
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="grid grid-cols-7 border-b border-white/10 text-center text-xs font-semibold text-gray-400 uppercase py-3">{DAY_NAMES.map(d => <div key={d}>{d}</div>)}</div>
      <div className="flex-1 grid grid-cols-7 grid-rows-6">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(events, day).filter((e: any) => categoryFilter === 'all' || e.category === categoryFilter);
          return (
            <div key={i} onClick={() => onClickDay(new Date(day))} className={`min-h-0 p-1.5 border-r border-b border-white/[0.06] cursor-pointer hover:bg-white/[0.03] ${day.getMonth() !== current.getMonth() ? "bg-white/[0.01]" : ""} ${isToday(day) ? "bg-violet-500/5" : ""}`}>
              <div className="mb-1"><span className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${isToday(day) ? "bg-violet-600 text-white" : day.getMonth() === current.getMonth() ? "text-gray-300" : "text-gray-600"}`}>{day.getDate()}</span></div>
              <div className="space-y-0.5 max-h-[100px] overflow-y-auto custom-scrollbar">
                {dayEvents.map((evt: any) => {
                  const s = getStyle(evt);
                  return <div key={evt.id} onClick={(e) => { e.stopPropagation(); onClickEvent(evt); }} className={`px-1 py-0.5 rounded text-[10px] truncate ${s.bg} ${s.text} ${s.border}`}>{evt.title}</div>;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({ current }: any) { return <div className="flex-1 flex flex-col overflow-hidden p-4 items-center justify-center border-t border-white/10"><p className="text-gray-400">Week View Loaded</p></div>; }
function DayView({ current }: any) { return <div className="flex-1 flex flex-col items-center justify-center p-4 border-t border-white/10"><p className="text-gray-400">Day View Loaded</p></div>; }
function AgendaView({ current }: any) { return <div className="flex-1 overflow-y-auto px-6 py-4 border-t border-white/10 text-gray-400">Agenda View Loaded</div>; }

function EventModal({ event, defaultDate, onSave, onDelete, onClose }: any) {
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
        <div className="flex justify-end gap-2">
          {event && onDelete && <button onClick={() => { onDelete(event.originalId || event.id); onClose(); }} className="px-4 py-2 text-red-400">Delete</button>}
          <button onClick={onClose} className="px-4 py-2 text-gray-400">Cancel</button>
          <button onClick={() => { onSave({ id: event?.id || `evt-${Date.now()}`, title, date, startTime, endTime, category, platform, description, imageUrl }); onClose(); }} className="px-4 py-2 bg-violet-600 text-white rounded">Save</button>
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
    return { id: post.id, originalId: post.id, title: post.title, description: post.content, date, startTime, category: post.status === "published" ? "publish" : "content", platform: post.platforms && post.platforms[0] ? post.platforms[0].platform.toLowerCase() : "none", completed: post.status === "published", allDay: !post.scheduledAt };
  });

  const [current, setCurrent] = useState(new Date()); const [miniMonth, setMiniMonth] = useState(new Date()); const [selectedDate, setSelectedDate] = useState(new Date()); const [viewMode, setViewMode] = useState("month"); const [categoryFilter, setCategoryFilter] = useState("all"); const [searchQuery, setSearchQuery] = useState(""); const [sidebarOpen, setSidebarOpen] = useState(true); const [modalOpen, setModalOpen] = useState(false); const [editingEvent, setEditingEvent] = useState<any>(null); const [defaultDate, setDefaultDate] = useState<any>(undefined);

  const navigate = useCallback((dir: number) => { const next = new Date(current); if (viewMode === "month") next.setMonth(current.getMonth() + dir); else if (viewMode === "week") next.setDate(current.getDate() + dir * 7); else if (viewMode === "day") next.setDate(current.getDate() + dir); setCurrent(next); }, [current, viewMode]);

  const handleSaveEvent = (event: any) => {
    const scheduledAt = event.startTime ? `${event.date}T${event.startTime}:00` : `${event.date}T09:00:00`; const isUpdating = !event.id.startsWith("evt-");
    if (isUpdating) { updatePost.mutate({ id: event.id, title: event.title, content: event.description, status: "scheduled", type: "text" }); schedulePost.mutate({ id: event.id, scheduledAt }); } else { addPost.mutate({ post: { title: event.title, content: event.description || "", type: "text", status: "scheduled", scheduled_at: scheduledAt }, platforms: [] }); }
  };
  const handleDeleteEvent = (id: string) => deletePost.mutate(id);

  const filteredEvents = searchQuery.trim() ? events.filter((e: any) => e.title.toLowerCase().includes(searchQuery.toLowerCase()) || (e.description || "").toLowerCase().includes(searchQuery.toLowerCase())) : events;
  const todayCount = events.filter((e: any) => e.date === formatDateKey(new Date())).length;
  const publishCount = events.filter((e: any) => e.category === "publish").length;
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
    <DashboardLayout>
      <DragDropImport onImport={(data) => { if (data.version === "1.0") processUJT(data); }} entityName="UJT">
        <div className="-m-6 h-[calc(100vh-64px)] w-[calc(100%+3rem)] bg-transparent text-white flex flex-col font-sans overflow-hidden">
          
          {/* Top Master Class Header */}
          <header className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-black/20 backdrop-blur-xl z-30">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(p => !p)} className="w-10 h-10 flex items-center justify-center rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-400">☰</button>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">📅</div>
              <div>
                <h1 className="text-base font-bold bg-gradient-to-r from-violet-300 to-indigo-300 bg-clip-text text-transparent leading-none">MyFlow</h1>
                <p className="text-[10px] text-gray-500 leading-none mt-0.5">Smart Calendar</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-md mx-6 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input aria-label="Search" title="Search events" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search events, tasks, content..." className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50" />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">✕</button>}
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-violet-500/30 text-violet-300 text-[11px] font-bold py-1.5 px-3 rounded-xl transition-all shadow-lg hover:shadow-violet-500/20 flex items-center gap-2">
                <span>📥 Import UJT</span>
                <input type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
              </label>
              <div className="hidden md:flex flex-wrap items-center gap-2">
                 <StatPill icon="📅" label={`${todayCount} today`} color="violet" />
                 <StatPill icon="📤" label={`${publishCount} posts`} color="amber" />
                 <StatPill icon="🚨" label={`${deadlineCount} deadlines`} color="red" />
              </div>
              <button aria-label="Notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">🔔{deadlineCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold flex items-center justify-center">{deadlineCount}</span>}</button>
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">C</div>
                <span className="text-sm text-gray-300 hidden md:block">Creator</span>
              </div>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {sidebarOpen && (
              <div className="w-[300px] bg-[#0f1117] border-r border-white/10 overflow-y-auto p-4 shrink-0 transition-all duration-300">
                <Sidebar events={filteredEvents} miniMonth={miniMonth} selectedDate={selectedDate} onSelectDate={(d: any) => { setSelectedDate(d); setCurrent(d); }} onChangeMiniMonth={(dir: any) => { const next = new Date(miniMonth); next.setMonth(miniMonth.getMonth() + dir); setMiniMonth(next); }} onAddEvent={() => { setEditingEvent(null); setDefaultDate(undefined); setModalOpen(true); }} onClickEvent={(evt: any) => { setEditingEvent(evt); setModalOpen(true); }} categoryFilter={categoryFilter} onFilterChange={setCategoryFilter} onClose={() => setSidebarOpen(false)} />
              </div>
            )}
            
            <div className="flex-1 flex flex-col overflow-hidden">
               {/* Calendar Grid Toolbar */}
               <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#0f1117]">
                 <div className="flex items-center gap-2">
                    <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">‹</button>
                    <button onClick={() => { setCurrent(new Date()); setSelectedDate(new Date()); }} className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${isToday(current) ? 'bg-violet-600/30 text-violet-300 border-violet-500/40' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>Today</button>
                    <button onClick={() => navigate(1)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">›</button>
                    <h2 className="text-base font-semibold text-white ml-2">{headerLabel}</h2>
                 </div>
                 <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
                    {['month', 'week', 'day', 'agenda'].map(m => (
                      <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-1.5 rounded-lg text-xs capitalize ${viewMode === m ? "bg-violet-600 shadow-md" : "text-gray-400 hover:text-gray-200"}`}>{m}</button>
                    ))}
                 </div>
               </div>
               
               {viewMode === "month" && <MonthView current={current} events={filteredEvents} categoryFilter={categoryFilter} onClickDay={(date: any) => { setSelectedDate(date); setDefaultDate(date); setEditingEvent(null); setModalOpen(true); }} onClickEvent={(evt: any) => { setEditingEvent(evt); setModalOpen(true); }} />}
               {viewMode === "week" && <WeekView current={current} />}
               {viewMode === "day" && <DayView current={current} />}
               {viewMode === "agenda" && <AgendaView current={current} />}
            </div>
          </div>
          {modalOpen && <EventModal event={editingEvent} defaultDate={defaultDate} onSave={handleSaveEvent} onDelete={handleDeleteEvent} onClose={() => { setModalOpen(false); setEditingEvent(null); }} />}
        </div>
      </DragDropImport>
    </DashboardLayout>
  );
}
