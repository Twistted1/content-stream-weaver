import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Share2, Mail, Bell, Plus, Search, Filter, ChevronDown, Trash2, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { AutomationCard } from "@/components/automation/AutomationCard";
import { AutomationDialog } from "@/components/automation/AutomationDialog";
import { AutomationHistoryDialog } from "@/components/automation/AutomationHistoryDialog";
import { useAppStore, Automation, TriggerType, AutomationStatus } from "@/stores/useAppStore";
import { triggerOptions, platformOptions, getQuickStats } from "@/components/automation/automationData";

export default function AutomationPage() {
  const {
    automations,
    automationRuns,
    addAutomation,
    updateAutomation,
    deleteAutomation,
    deleteAutomations,
    toggleAutomation,
    toggleAutomations,
    duplicateAutomation,
    runAutomation,
    completeAutomationRun,
  } = useAppStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AutomationStatus>("all");
  const [triggerFilter, setTriggerFilter] = useState<"all" | TriggerType>("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const quickStats = getQuickStats(automations);

  const filteredAutomations = useMemo(() => {
    return automations.filter((automation) => {
      const matchesSearch =
        automation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        automation.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || automation.status === statusFilter;
      const matchesTrigger = triggerFilter === "all" || automation.trigger === triggerFilter;
      return matchesSearch && matchesStatus && matchesTrigger;
    });
  }, [automations, searchQuery, statusFilter, triggerFilter]);

  const handleToggle = (id: string) => {
    const automation = automations.find((a) => a.id === id);
    toggleAutomation(id);
    toast.success(
      `${automation?.name} ${automation?.status === "active" ? "paused" : "activated"}`
    );
  };

  const handleSave = (data: Omit<Automation, "id" | "createdAt" | "lastRun" | "runs">) => {
    if (editingAutomation) {
      updateAutomation(editingAutomation.id, data);
      toast.success("Automation updated");
    } else {
      addAutomation(data);
      toast.success("Automation created");
    }
    setEditingAutomation(null);
  };

  const handleEdit = (automation: Automation) => {
    setEditingAutomation(automation);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    const automation = automations.find((a) => a.id === id);
    deleteAutomation(id);
    setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    toast.success(`${automation?.name} deleted`);
  };

  const handleDuplicate = (id: string) => {
    const automation = automations.find((a) => a.id === id);
    duplicateAutomation(id);
    toast.success(`${automation?.name} duplicated`);
  };

  const handleRun = (id: string) => {
    const automation = automations.find((a) => a.id === id);
    if (!automation) return;

    const runId = runAutomation(id);
    toast.info(`Running ${automation.name}...`);

    setTimeout(() => {
      const success = Math.random() > 0.2;
      completeAutomationRun(
        runId,
        success,
        success
          ? `Successfully executed on ${automation.platforms.join(", ")}`
          : "Failed to connect to one or more platforms",
        id
      );
      if (success) {
        toast.success(`${automation.name} completed successfully`);
      } else {
        toast.error(`${automation.name} failed`);
      }
    }, 2000);
  };

  const handleViewHistory = (automation: Automation) => {
    setSelectedAutomation(automation);
    setHistoryOpen(true);
  };

  const handleCreate = () => {
    setEditingAutomation(null);
    setDialogOpen(true);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredAutomations.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((sid) => sid !== id));
    }
  };

  const handleBulkActivate = () => {
    toggleAutomations(selectedIds, "active");
    toast.success(`${selectedIds.length} automations activated`);
    setSelectedIds([]);
  };

  const handleBulkPause = () => {
    toggleAutomations(selectedIds, "paused");
    toast.success(`${selectedIds.length} automations paused`);
    setSelectedIds([]);
  };

  const handleBulkDelete = () => {
    deleteAutomations(selectedIds);
    toast.success(`${selectedIds.length} automations deleted`);
    setSelectedIds([]);
  };

  const allSelected = filteredAutomations.length > 0 && selectedIds.length === filteredAutomations.length;
  const someSelected = selectedIds.length > 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Automation</h1>
            <p className="text-muted-foreground">
              Automate your content workflows and save time
            </p>
          </div>
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            Create Automation
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickStats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-muted ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Automations List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Your Automations
                </CardTitle>
                <CardDescription>
                  Manage and monitor your automated workflows
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search automations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 w-[200px]"
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | AutomationStatus)}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={triggerFilter} onValueChange={(v) => setTriggerFilter(v as "all" | TriggerType)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Triggers</SelectItem>
                    {triggerOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Bulk Actions Bar */}
            {filteredAutomations.length > 0 && (
              <div className="flex items-center gap-4 pb-2 border-b border-border">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  {someSelected ? `${selectedIds.length} selected` : "Select all"}
                </span>
                {someSelected && (
                  <div className="flex items-center gap-2 ml-auto">
                    <Button variant="outline" size="sm" onClick={handleBulkActivate}>
                      <Play className="h-4 w-4 mr-1" />
                      Activate
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleBulkPause}>
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            )}

            {filteredAutomations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {automations.length === 0
                  ? "No automations yet. Create one to get started!"
                  : "No automations match your search criteria."}
              </div>
            ) : (
              filteredAutomations.map((automation) => (
                <div key={automation.id} className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedIds.includes(automation.id)}
                    onCheckedChange={(checked) => handleSelectOne(automation.id, !!checked)}
                  />
                  <div className="flex-1">
                    <AutomationCard
                      automation={automation}
                      onToggle={handleToggle}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onRun={handleRun}
                      onViewHistory={handleViewHistory}
                      onDuplicate={handleDuplicate}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handleCreate}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20 text-primary">
                <Share2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Cross-Platform Posting</h3>
                <p className="text-sm text-muted-foreground">
                  Post to multiple platforms at once
                </p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handleCreate}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Email Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Get alerts for important events
                </p>
              </div>
            </CardContent>
          </Card>
          <Card
            className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={handleCreate}
          >
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20 text-primary">
                <Bell className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-foreground">Smart Scheduling</h3>
                <p className="text-sm text-muted-foreground">
                  Optimal posting times by AI
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <AutomationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        automation={editingAutomation}
        onSave={handleSave}
      />
      <AutomationHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        automation={selectedAutomation}
        runs={automationRuns}
      />
    </DashboardLayout>
  );
}