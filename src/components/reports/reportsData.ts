import { TrendingUp, Users, PieChart, BarChart3, Clock, FileText, Target, DollarSign } from "lucide-react";
import { Report } from "./ReportCard";

export const initialReports: Report[] = [
  {
    id: 1,
    name: "Monthly Performance Report",
    description: "Overview of key metrics and KPIs for the month",
    type: "Performance",
    icon: TrendingUp,
    lastGenerated: "2024-01-15",
    status: "Ready",
    format: "PDF",
  },
  {
    id: 2,
    name: "User Engagement Analysis",
    description: "Detailed breakdown of user behavior and engagement patterns",
    type: "Analytics",
    icon: Users,
    lastGenerated: "2024-01-14",
    status: "Ready",
    format: "Excel",
  },
  {
    id: 3,
    name: "Revenue Breakdown",
    description: "Financial analysis by product, region, and channel",
    type: "Financial",
    icon: PieChart,
    lastGenerated: "2024-01-13",
    status: "Ready",
    format: "PDF",
  },
  {
    id: 4,
    name: "Traffic Sources Report",
    description: "Analysis of traffic acquisition channels and campaigns",
    type: "Marketing",
    icon: BarChart3,
    lastGenerated: "2024-01-12",
    status: "Processing",
    format: "PDF",
  },
  {
    id: 5,
    name: "Weekly Team Productivity",
    description: "Team performance metrics and task completion rates",
    type: "Performance",
    icon: Clock,
    lastGenerated: "2024-01-11",
    status: "Ready",
    format: "Excel",
  },
  {
    id: 6,
    name: "Content Performance",
    description: "Analysis of content engagement and reach metrics",
    type: "Marketing",
    icon: FileText,
    lastGenerated: "2024-01-10",
    status: "Ready",
    format: "PDF",
  },
  {
    id: 7,
    name: "Conversion Funnel Analysis",
    description: "Detailed breakdown of user journey and conversion points",
    type: "Analytics",
    icon: Target,
    lastGenerated: "2024-01-09",
    status: "Ready",
    format: "PDF",
  },
  {
    id: 8,
    name: "Q4 Financial Summary",
    description: "Quarterly financial overview with projections",
    type: "Financial",
    icon: DollarSign,
    lastGenerated: "2024-01-08",
    status: "Failed",
    format: "Excel",
  },
];

export interface ScheduledReport {
  id: number;
  name: string;
  frequency: string;
  nextRun: string;
}

export const initialScheduledReports: ScheduledReport[] = [
  { id: 1, name: "Weekly Summary", frequency: "Every Monday", nextRun: "Jan 22, 2024" },
  { id: 2, name: "Monthly Analytics", frequency: "1st of month", nextRun: "Feb 1, 2024" },
  { id: 3, name: "Daily Traffic", frequency: "Daily at 9am", nextRun: "Tomorrow" },
];

export const reportStats = {
  total: 24,
  generatedThisMonth: 12,
  scheduled: 5,
  storageUsed: "2.4 GB",
};

export const quickTemplates = [
  { name: "Executive Summary", icon: FileText },
  { name: "Sales Dashboard", icon: BarChart3 },
  { name: "Team Performance", icon: Users },
  { name: "ROI Analysis", icon: TrendingUp },
];

export const typeIcons = {
  Performance: TrendingUp,
  Analytics: BarChart3,
  Financial: PieChart,
  Marketing: FileText,
};
