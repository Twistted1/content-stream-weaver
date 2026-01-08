import { LucideIcon, Zap, Clock, Share2, RefreshCw } from "lucide-react";

export type AutomationStatus = "active" | "paused";
export type TriggerType = "scheduled" | "new-content" | "engagement" | "manual";

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  triggerConfig: {
    schedule?: string; // cron-like: "daily", "weekly", "hourly"
    threshold?: number;
  };
  platforms: string[];
  status: AutomationStatus;
  lastRun: string | null;
  runs: number;
  createdAt: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  status: "success" | "failed" | "running";
  startedAt: string;
  completedAt: string | null;
  message: string;
}

export interface QuickStat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

export const triggerOptions: { value: TriggerType; label: string }[] = [
  { value: "scheduled", label: "Scheduled Time" },
  { value: "new-content", label: "New Content" },
  { value: "engagement", label: "Engagement Threshold" },
  { value: "manual", label: "Manual Trigger" },
];

export const scheduleOptions = [
  { value: "hourly", label: "Every Hour" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

export const platformOptions = [
  "YouTube",
  "TikTok",
  "Instagram",
  "Facebook",
  "X",
  "LinkedIn",
  "Email",
  "Slack",
  "Google Drive",
];

export const initialAutomations: Automation[] = [
  {
    id: "1",
    name: "Auto-publish to all platforms",
    description: "Automatically publish scheduled content to YouTube, TikTok, Instagram, Facebook, X, and LinkedIn",
    trigger: "scheduled",
    triggerConfig: { schedule: "daily" },
    platforms: ["YouTube", "TikTok", "Instagram", "Facebook", "X", "LinkedIn"],
    status: "active",
    lastRun: "2 hours ago",
    runs: 156,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Cross-post new blog articles",
    description: "When a new blog post is published, create social media posts for all platforms",
    trigger: "new-content",
    triggerConfig: {},
    platforms: ["X", "LinkedIn", "Facebook"],
    status: "active",
    lastRun: "1 day ago",
    runs: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Weekly performance digest",
    description: "Send weekly email report with analytics from all connected platforms",
    trigger: "scheduled",
    triggerConfig: { schedule: "weekly" },
    platforms: ["Email"],
    status: "active",
    lastRun: "3 days ago",
    runs: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Engagement notifications",
    description: "Get notified when posts exceed engagement thresholds",
    trigger: "engagement",
    triggerConfig: { threshold: 1000 },
    platforms: ["Slack", "Email"],
    status: "paused",
    lastRun: "1 week ago",
    runs: 89,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Content backup",
    description: "Automatically backup all published content to cloud storage",
    trigger: "scheduled",
    triggerConfig: { schedule: "daily" },
    platforms: ["Google Drive"],
    status: "active",
    lastRun: "12 hours ago",
    runs: 365,
    createdAt: new Date().toISOString(),
  },
];

export const getQuickStats = (automations: Automation[]): QuickStat[] => {
  const activeCount = automations.filter((a) => a.status === "active").length;
  const totalRuns = automations.reduce((sum, a) => sum + a.runs, 0);
  const uniquePlatforms = new Set(automations.flatMap((a) => a.platforms)).size;

  return [
    { label: "Active Automations", value: String(activeCount), icon: Zap, color: "text-emerald-500" },
    { label: "Total Runs", value: String(totalRuns), icon: RefreshCw, color: "text-blue-500" },
    { label: "Time Saved", value: `${Math.floor(totalRuns * 0.05)}h`, icon: Clock, color: "text-purple-500" },
    { label: "Connected Apps", value: String(uniquePlatforms), icon: Share2, color: "text-orange-500" },
  ];
};
