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
import { useTranslation } from "react-i18next";

const mainNavItems = [
  { icon: LayoutDashboard, labelKey: "nav.overview", href: "/dashboard" },
  { icon: Share2, labelKey: "nav.platforms", href: "/platforms" },
  { icon: FolderKanban, labelKey: "nav.projects", href: "/projects" },
  { icon: Calendar, labelKey: "nav.calendar", href: "/calendar" },
  { icon: StickyNote, labelKey: "nav.notes", href: "/notes" },
  { icon: Target, labelKey: "nav.strategies", href: "/strategies" },
];

const toolsNavItems = [
  { icon: Sparkles, labelKey: "nav.aiAssistant", href: "/ai" },
  { icon: Settings, labelKey: "nav.automation", href: "/automation" },
  { icon: FileText, labelKey: "nav.templates", href: "/templates" },
  { icon: BarChart3, labelKey: "nav.analytics", href: "/analytics" },
  { icon: FileSpreadsheet, labelKey: "nav.reports", href: "/reports" },
  { icon: GanttChart, labelKey: "nav.ganttChart", href: "/gantt" },
];

const adminNavItems = [
  { icon: Users, labelKey: "nav.users", href: "/users" },
  { icon: Upload, labelKey: "nav.importData", href: "/import" },
];

interface NavItemProps {
  icon: React.ElementType;
  labelKey: string;
  href: string;
}

const NavItem = ({ icon: Icon, labelKey, href }: NavItemProps) => {
  const { t } = useTranslation();
  return (
    <NavLink
      to={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
        "text-sidebar-foreground hover:text-sidebar-accent-foreground hover:bg-sidebar-accent"
      )}
      activeClassName="bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
    >
      <Icon className="h-5 w-5" />
      <span>{t(labelKey)}</span>
    </NavLink>
  );
};

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
  const { t } = useTranslation();
  
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
        <NavSection title={t("nav.main")} items={mainNavItems} />
        <NavSection title={t("nav.tools")} items={toolsNavItems} />
        <NavSection title={t("nav.admin")} items={adminNavItems} />
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-sidebar-border">
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 w-full transition-colors">
          <LogOut className="h-5 w-5" />
          <span>{t("common.logout")}</span>
        </button>
      </div>
    </aside>
  );
}
