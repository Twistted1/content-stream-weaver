import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Share2, Mail, Bell, Plus } from "lucide-react";
import { toast } from "sonner";
import { AutomationCard } from "@/components/automation/AutomationCard";
import { AutomationDialog } from "@/components/automation/AutomationDialog";
import { AutomationHistoryDialog } from "@/components/automation/AutomationHistoryDialog";
import {
  Automation,
  AutomationRun,
  initialAutomations,
  getQuickStats,
} from "@/components/automation/automationData";

export default function AutomationPage() {
  const [automations, setAutomations] = useState<Automation[]>(initialAutomations);
  const [runs, setRuns] = useState<AutomationRun[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<Automation | null>(null);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

  const quickStats = getQuickStats(automations);

  const handleToggle = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "paused" : "active" }
          : a
      )
    );
    const automation = automations.find((a) => a.id === id);
    toast.success(
      `${automation?.name} ${automation?.status === "active" ? "paused" : "activated"}`
    );
  };

  const handleSave = (data: Omit<Automation, "id" | "createdAt" | "lastRun" | "runs">) => {
    if (editingAutomation) {
      setAutomations((prev) =>
        prev.map((a) =>
          a.id === editingAutomation.id ? { ...a, ...data } : a
        )
      );
      toast.success("Automation updated");
    } else {
      const newAutomation: Automation = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastRun: null,
        runs: 0,
      };
      setAutomations((prev) => [...prev, newAutomation]);
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
    setAutomations((prev) => prev.filter((a) => a.id !== id));
    toast.success(`${automation?.name} deleted`);
  };

  const handleRun = (id: string) => {
    const automation = automations.find((a) => a.id === id);
    if (!automation) return;

    const newRun: AutomationRun = {
      id: Date.now().toString(),
      automationId: id,
      status: "running",
      startedAt: new Date().toISOString(),
      completedAt: null,
      message: "Automation started...",
    };
    setRuns((prev) => [newRun, ...prev]);
    toast.info(`Running ${automation.name}...`);

    // Simulate completion
    setTimeout(() => {
      const success = Math.random() > 0.2;
      setRuns((prev) =>
        prev.map((r) =>
          r.id === newRun.id
            ? {
                ...r,
                status: success ? "success" : "failed",
                completedAt: new Date().toISOString(),
                message: success
                  ? `Successfully executed on ${automation.platforms.join(", ")}`
                  : "Failed to connect to one or more platforms",
              }
            : r
        )
      );
      setAutomations((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, runs: a.runs + 1, lastRun: "Just now" }
            : a
        )
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
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Your Automations
            </CardTitle>
            <CardDescription>
              Manage and monitor your automated workflows
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {automations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No automations yet. Create one to get started!
              </div>
            ) : (
              automations.map((automation) => (
                <AutomationCard
                  key={automation.id}
                  automation={automation}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onRun={handleRun}
                  onViewHistory={handleViewHistory}
                />
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
        runs={runs}
      />
    </DashboardLayout>
  );
}
