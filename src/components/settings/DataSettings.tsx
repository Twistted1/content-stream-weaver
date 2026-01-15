import { useState } from "react";
import {
  Download,
  Upload,
  Database,
  FileJson,
  FileSpreadsheet,
  Archive,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface ExportJob {
  id: string;
  type: "full" | "partial";
  format: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  createdAt: string;
  downloadUrl?: string;
}

const recentExports: ExportJob[] = [
  {
    id: "1",
    type: "full",
    format: "JSON",
    status: "completed",
    progress: 100,
    createdAt: "2026-01-10",
    downloadUrl: "#",
  },
  {
    id: "2",
    type: "partial",
    format: "CSV",
    status: "completed",
    progress: 100,
    createdAt: "2026-01-05",
    downloadUrl: "#",
  },
];

export function DataSettings() {
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState("json");
  const [exportOptions, setExportOptions] = useState({
    posts: true,
    analytics: true,
    automations: true,
    settings: true,
    users: false,
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [jobs, setJobs] = useState<ExportJob[]>(recentExports);

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          setShowExportDialog(false);
          
          const newJob: ExportJob = {
            id: Date.now().toString(),
            type: Object.values(exportOptions).every(Boolean) ? "full" : "partial",
            format: exportFormat.toUpperCase(),
            status: "completed",
            progress: 100,
            createdAt: new Date().toISOString().split("T")[0],
            downloadUrl: "#",
          };
          
          setJobs([newJob, ...jobs]);
          toast.success("Export completed! Your download is ready.");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleImport = () => {
    toast.success("Import started. This may take a few minutes.");
    setShowImportDialog(false);
  };

  const handleDeleteData = () => {
    toast.success("Data deletion request submitted. This action cannot be undone.");
    setShowDeleteDialog(false);
  };

  const storageData = {
    used: 2.4,
    total: 10,
    breakdown: [
      { label: "Media files", size: 1.2, color: "bg-primary" },
      { label: "Analytics data", size: 0.8, color: "bg-blue-500" },
      { label: "Posts & content", size: 0.3, color: "bg-green-500" },
      { label: "Other", size: 0.1, color: "bg-orange-500" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Storage Usage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Storage Usage
          </CardTitle>
          <CardDescription>
            Monitor your data storage across all categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{storageData.used} GB used</span>
              <span className="text-muted-foreground">{storageData.total} GB total</span>
            </div>
            <Progress value={(storageData.used / storageData.total) * 100} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {storageData.breakdown.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${item.color}`} />
                <span className="text-sm">{item.label}</span>
                <span className="text-sm text-muted-foreground ml-auto">
                  {item.size} GB
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Data
              </CardTitle>
              <CardDescription>
                Download a copy of your data in various formats
              </CardDescription>
            </div>
            <Button onClick={() => setShowExportDialog(true)}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm font-medium">Recent Exports</p>
            {jobs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent exports</p>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {job.format === "JSON" ? (
                      <FileJson className="h-5 w-5 text-primary" />
                    ) : (
                      <FileSpreadsheet className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {job.type === "full" ? "Full Export" : "Partial Export"} - {job.format}
                      </p>
                      <p className="text-xs text-muted-foreground">{job.createdAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={job.status === "completed" ? "default" : "secondary"}
                    >
                      {job.status === "completed" ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {job.status}
                    </Badge>
                    {job.downloadUrl && (
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Import Data */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Import Data
              </CardTitle>
              <CardDescription>
                Import data from another platform or backup
              </CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowImportDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Supported formats: JSON, CSV, ZIP archives from compatible platforms
          </p>
        </CardContent>
      </Card>

      {/* Backup & Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Backup & Sync
          </CardTitle>
          <CardDescription>
            Configure automatic backups and sync settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Automatic Backups</Label>
              <p className="text-sm text-muted-foreground">
                Daily automatic backup of your data
              </p>
            </div>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Last Backup</Label>
              <p className="text-sm text-muted-foreground">
                January 15, 2026 at 3:00 AM
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Backup Now
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Deletion */}
      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Data
          </CardTitle>
          <CardDescription>
            Permanently delete selected data from your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Clear All Data</Label>
              <p className="text-sm text-muted-foreground">
                This will permanently delete all your posts, analytics, and settings
              </p>
            </div>
            <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
            <DialogDescription>
              Choose what data to export and the format
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON (Recommended)</SelectItem>
                  <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                  <SelectItem value="zip">ZIP Archive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-3">
              <Label>Data to Export</Label>
              {Object.entries(exportOptions).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <Checkbox
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setExportOptions({ ...exportOptions, [key]: checked as boolean })
                    }
                  />
                  <Label htmlFor={key} className="font-normal capitalize cursor-pointer">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </Label>
                </div>
              ))}
            </div>
            {isExporting && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Exporting...</span>
                  <span>{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isExporting}>
              {isExporting ? "Exporting..." : "Start Export"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Data</DialogTitle>
            <DialogDescription>
              Upload a file to import data into your account
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm font-medium">Drop your file here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                JSON, CSV, or ZIP up to 100MB
              </p>
              <Button variant="outline" className="mt-4">
                Select File
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleImport}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Confirm Data Deletion
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm">
              Please type <span className="font-mono font-bold">DELETE</span> to confirm:
            </p>
            <input
              type="text"
              className="mt-2 w-full px-3 py-2 border rounded-md bg-background"
              placeholder="Type DELETE to confirm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteData}>
              Delete All Data
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
