import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Clock,
  MoreVertical
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const reports = [
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
];

const scheduledReports = [
  { name: "Weekly Summary", frequency: "Every Monday", nextRun: "Jan 22, 2024" },
  { name: "Monthly Analytics", frequency: "1st of month", nextRun: "Feb 1, 2024" },
  { name: "Daily Traffic", frequency: "Daily at 9am", nextRun: "Tomorrow" },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Ready":
      return "bg-green-500/10 text-green-500";
    case "Processing":
      return "bg-yellow-500/10 text-yellow-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "Performance":
      return "bg-primary/10 text-primary";
    case "Analytics":
      return "bg-blue-500/10 text-blue-500";
    case "Financial":
      return "bg-green-500/10 text-green-500";
    case "Marketing":
      return "bg-purple-500/10 text-purple-500";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Reports() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and manage your business reports
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search reports..." className="pl-10" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[150px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="performance">Performance</SelectItem>
              <SelectItem value="analytics">Analytics</SelectItem>
              <SelectItem value="financial">Financial</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-full sm:w-[150px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Reports List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold">Available Reports</h2>
            <div className="space-y-3">
              {reports.map((report) => (
                <Card key={report.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="rounded-lg bg-muted p-3">
                        <report.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium">{report.name}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {report.description}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="shrink-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Report</DropdownMenuItem>
                              <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                              <DropdownMenuItem>Schedule</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge variant="secondary" className={getTypeColor(report.type)}>
                            {report.type}
                          </Badge>
                          <Badge variant="secondary" className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            Last generated: {report.lastGenerated}
                          </span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-3 w-3" />
                            {report.format}
                          </Button>
                          <Button size="sm" variant="ghost">
                            Regenerate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Report Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Reports</span>
                  <span className="font-medium">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Generated This Month</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled</span>
                  <span className="font-medium">5</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage Used</span>
                  <span className="font-medium">2.4 GB</span>
                </div>
              </CardContent>
            </Card>

            {/* Scheduled Reports */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scheduled Reports</CardTitle>
                <CardDescription>Upcoming automated reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {scheduledReports.map((report, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="h-3 w-3 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.frequency}</p>
                      <p className="text-xs text-muted-foreground">Next: {report.nextRun}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  <Plus className="mr-2 h-3 w-3" />
                  Schedule New
                </Button>
              </CardContent>
            </Card>

            {/* Report Templates */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Executive Summary
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Sales Dashboard
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Team Performance
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
