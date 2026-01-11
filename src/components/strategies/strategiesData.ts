import { TrendingUp, Clock, CheckCircle2, AlertCircle, LucideIcon } from "lucide-react";

export type StrategyStatus = "active" | "planning" | "completed" | "paused";

export interface StrategyGoal {
  id: string;
  title: string;
  completed: boolean;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  status: StrategyStatus;
  progress: number;
  startDate: string;
  endDate: string;
  goalItems: StrategyGoal[];
  assignees: string[];
  platforms: string[];
  createdAt: string;
}

export const statusConfig: Record<StrategyStatus, { label: string; variant: "default" | "secondary" | "outline" | "destructive"; icon: LucideIcon }> = {
  active: { label: "Active", variant: "default", icon: TrendingUp },
  planning: { label: "Planning", variant: "secondary", icon: Clock },
  completed: { label: "Completed", variant: "outline", icon: CheckCircle2 },
  paused: { label: "Paused", variant: "destructive", icon: AlertCircle },
};

export const platformOptions = [
  "Instagram",
  "Twitter",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Facebook",
  "All Platforms",
];

export const teamMemberOptions = [
  { initials: "JD", name: "John Doe" },
  { initials: "SM", name: "Sarah Miller" },
  { initials: "AK", name: "Alex Kim" },
  { initials: "RB", name: "Rachel Brown" },
  { initials: "TW", name: "Tom Wilson" },
];
