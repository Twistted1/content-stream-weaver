import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar, FileText, BarChart3, PieChart, TrendingUp } from "lucide-react";

interface CreateReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateReport: (report: {
    name: string;
    description: string;
    type: string;
    format: string;
    schedule: boolean;
    frequency?: string;
  }) => void;
}

const reportTypes = [
  { value: "Performance", label: "Performance", icon: TrendingUp },
  { value: "Analytics", label: "Analytics", icon: BarChart3 },
  { value: "Financial", label: "Financial", icon: PieChart },
  { value: "Marketing", label: "Marketing", icon: FileText },
];

export function CreateReportDialog({
  open,
  onOpenChange,
  onCreateReport,
}: CreateReportDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [format, setFormat] = useState("PDF");
  const [schedule, setSchedule] = useState(false);
  const [frequency, setFrequency] = useState("weekly");

  const handleSubmit = () => {
    if (!name || !type) return;

    onCreateReport({
      name,
      description,
      type,
      format,
      schedule,
      frequency: schedule ? frequency : undefined,
    });

    // Reset form
    setName("");
    setDescription("");
    setType("");
    setFormat("PDF");
    setSchedule(false);
    setFrequency("weekly");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Report</DialogTitle>
          <DialogDescription>
            Configure your report settings and generate it now or schedule for later.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Report Name</Label>
            <Input
              id="name"
              placeholder="e.g., Monthly Sales Report"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this report covers..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Report Type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      <div className="flex items-center gap-2">
                        <t.icon className="h-4 w-4" />
                        {t.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Format</Label>
              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Excel">Excel</SelectItem>
                  <SelectItem value="CSV">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Label htmlFor="schedule" className="cursor-pointer">
                  Schedule Report
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Automatically generate this report on a schedule
              </p>
            </div>
            <Switch
              id="schedule"
              checked={schedule}
              onCheckedChange={setSchedule}
            />
          </div>

          {schedule && (
            <div className="space-y-2">
              <Label>Frequency</Label>
              <Select value={frequency} onValueChange={setFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !type}>
            Create Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
