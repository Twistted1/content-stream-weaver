import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Share2,
  FolderKanban,
  Calendar,
  StickyNote,
  Target,
  Sparkles,
  Settings,
  FileText,
  BarChart3,
  FileSpreadsheet,
  GanttChart,
  Users,
  Upload,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";

const mainNavItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/dashboard" },
  { icon: Share2, label: "Platforms", href: "/platforms" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: Calendar, label: "Calendar", href: "/calendar" },
  { icon: StickyNote, label: "Notes", href: "/notes" },
  { icon: Target, label: "Strategies", href: "/strategies" },
];

const toolsNavItems = [
  { icon: Sparkles, label: "AI Assistant", href: "/ai" },
  { icon: Settings, label: "Automation", href: "/automation" },
  { icon: FileText, label: "Templates", href: "/templates" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: FileSpreadsheet, label: "Reports", href: "/reports" },
  { icon: GanttChart, label: "Gantt Chart", href: "/gantt" },
];

const adminNavItems = [
  { icon: Users, label: "Users", href: "/users" },
  { icon: Upload, label: "Import Data", href: "/import" },
];

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
}

const NavItem = ({ icon: Icon, label, href }: NavItemProps) => (
  <NavLink
    to={href}
    className={cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
      "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
    )}
    activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </NavLink>
);

const NavSection = ({ title, items }: { title: string; items: NavItemProps[] }) => (
  <div className="space-y-1">
    <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
      {title}
    </h3>
    {items.map((item) => (
      <NavItem key={item.href} {...item} />
    ))}
  </div>
);

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
          <span className="text-lg font-bold text-primary-foreground">CH</span>
        </div>
        <div>
          <h1 className="font-semibold text-foreground">Content Hub</h1>
          <p className="text-xs text-muted-foreground">Headless CMS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <NavSection title="Main" items={mainNavItems} />
        <NavSection title="Tools" items={toolsNavItems} />
        <NavSection title="Admin" items={adminNavItems} />
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
