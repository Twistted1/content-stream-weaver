import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { ReportCard, Report } from "@/components/reports/ReportCard";
import { CreateReportDialog } from "@/components/reports/CreateReportDialog";
import { ReportPreviewDialog } from "@/components/reports/ReportPreviewDialog";
import {
  initialReports,
  initialScheduledReports,
  reportStats,
  quickTemplates,
  typeIcons,
  ScheduledReport,
} from "@/components/reports/reportsData";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>(initialScheduledReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("recent");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const [deleteReport, setDeleteReport] = useState<Report | null>(null);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const matchesSearch =
        report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        typeFilter === "all" || report.type.toLowerCase() === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [reports, searchQuery, typeFilter]);

  const handleCreateReport = (data: {
    name: string;
    description: string;
    type: string;
    format: string;
    schedule: boolean;
    frequency?: string;
  }) => {
    const newReport: Report = {
      id: Date.now(),
      name: data.name,
      description: data.description,
      type: data.type as Report["type"],
      icon: typeIcons[data.type as keyof typeof typeIcons],
      lastGenerated: new Date().toISOString().split("T")[0],
      status: "Processing",
      format: data.format as Report["format"],
    };

    setReports((prev) => [newReport, ...prev]);

    // Simulate processing completion
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === newReport.id ? { ...r, status: "Ready" as const } : r))
      );
      toast.success(`"${data.name}" is ready for download`);
    }, 3000);

    if (data.schedule && data.frequency) {
      const newScheduled: ScheduledReport = {
        id: Date.now(),
        name: data.name,
        frequency: data.frequency.charAt(0).toUpperCase() + data.frequency.slice(1),
        nextRun: getNextRunDate(data.frequency),
      };
      setScheduledReports((prev) => [...prev, newScheduled]);
    }

    toast.success("Report created successfully");
  };

  const getNextRunDate = (frequency: string): string => {
    const now = new Date();
    switch (frequency) {
      case "daily":
        return "Tomorrow";
      case "weekly":
        now.setDate(now.getDate() + 7);
        return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      case "monthly":
        now.setMonth(now.getMonth() + 1);
        return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      case "quarterly":
        now.setMonth(now.getMonth() + 3);
        return now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      default:
        return "TBD";
    }
  };

  const handleDownload = (report: Report) => {
    toast.success(`Downloading ${report.name}.${report.format.toLowerCase()}`);
  };

  const handleRegenerate = (report: Report) => {
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: "Processing" as const } : r))
    );
    toast.info(`Regenerating "${report.name}"...`);

    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id === report.id
            ? { ...r, status: "Ready" as const, lastGenerated: new Date().toISOString().split("T")[0] }
            : r
        )
      );
      toast.success(`"${report.name}" has been regenerated`);
    }, 2500);
  };

  const handleView = (report: Report) => {
    setPreviewReport(report);
  };

  const handleDeleteConfirm = () => {
    if (!deleteReport) return;
    setReports((prev) => prev.filter((r) => r.id !== deleteReport.id));
    toast.success(`"${deleteReport.name}" has been deleted`);
    setDeleteReport(null);
  };

  const handleSchedule = (report: Report) => {
    toast.info(`Opening schedule options for "${report.name}"`);
  };

  const handleQuickTemplate = (templateName: string) => {
    setCreateDialogOpen(true);
    toast.info(`Template "${templateName}" selected`);
  };

  const handleRemoveScheduled = (id: number) => {
    setScheduledReports((prev) => prev.filter((r) => r.id !== id));
    toast.success("Scheduled report removed");
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-foreground">Reports</h1>
            <p className="text-muted-foreground">
              Generate and manage your business reports
            </p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Report
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search reports..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
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
          <Select value={dateFilter} onValueChange={setDateFilter}>
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
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Available Reports</h2>
              <span className="text-sm text-muted-foreground">
                {filteredReports.length} of {reports.length} reports
              </span>
            </div>
            <div className="space-y-3">
              {filteredReports.length > 0 ? (
                filteredReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    onDownload={handleDownload}
                    onRegenerate={handleRegenerate}
                    onView={handleView}
                    onDelete={setDeleteReport}
                    onSchedule={handleSchedule}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No reports found</h3>
                    <p className="text-sm text-muted-foreground text-center mt-1">
                      {searchQuery || typeFilter !== "all"
                        ? "Try adjusting your search or filters"
                        : "Create your first report to get started"}
                    </p>
                    <Button className="mt-4" onClick={() => setCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Report
                    </Button>
                  </CardContent>
                </Card>
              )}
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
                  <span className="font-medium">{reports.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Generated This Month</span>
                  <span className="font-medium">{reportStats.generatedThisMonth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled</span>
                  <span className="font-medium">{scheduledReports.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Storage Used</span>
                  <span className="font-medium">{reportStats.storageUsed}</span>
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
                {scheduledReports.length > 0 ? (
                  scheduledReports.map((report) => (
                    <div key={report.id} className="flex items-start gap-3 group">
                      <div className="rounded-full bg-primary/10 p-2">
                        <Calendar className="h-3 w-3 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-muted-foreground">{report.frequency}</p>
                        <p className="text-xs text-muted-foreground">Next: {report.nextRun}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleRemoveScheduled(report.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No scheduled reports
                  </p>
                )}
                <Button
                  variant="outline"
                  className="w-full"
                  size="sm"
                  onClick={() => setCreateDialogOpen(true)}
                >
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
                {quickTemplates.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                    onClick={() => handleQuickTemplate(template.name)}
                  >
                    <template.icon className="mr-2 h-4 w-4" />
                    {template.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Report Dialog */}
      <CreateReportDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateReport={handleCreateReport}
      />

      {/* Report Preview Dialog */}
      <ReportPreviewDialog
        open={!!previewReport}
        onOpenChange={(open) => !open && setPreviewReport(null)}
        report={previewReport}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteReport} onOpenChange={(open) => !open && setDeleteReport(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteReport?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
