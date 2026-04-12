import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Zap, Play, Clock, CheckCircle2, XCircle, Loader2,
  Image, FileText, Send, Calendar, Webhook, Plus, Trash2,
  Sparkles, ArrowRight, Globe
} from "lucide-react";
import { useContentPipeline, type PipelineRun, type WebhookConfig } from "@/hooks/useContentPipeline";
import { format } from "date-fns";

const PLATFORM_OPTIONS = [
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "website", label: "Website" },
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "running": return <Loader2 className="h-4 w-4 text-primary animate-spin" />;
    case "failed": return <XCircle className="h-4 w-4 text-destructive" />;
    default: return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

const getStepLabel = (step: string) => {
  const labels: Record<string, string> = {
    started: "Pipeline started",
    generating_content: "Generating content with AI...",
    content_generated: "Content generated ✓",
    generating_image: "Generating cover image with DALL-E...",
    image_generated: "Cover image created ✓",
    image_failed: "Image generation failed (continuing...)",
    image_skipped: "Image skipped",
    creating_post: "Creating post...",
    post_created: "Post created ✓",
    firing_webhooks: "Firing publish webhooks...",
    webhooks_fired: "Webhooks dispatched ✓",
  };
  return labels[step] || step;
};

export default function ContentPipeline() {
  const { pipelineRuns, webhooks, isLoading, runPipeline, addWebhook, deleteWebhook, toggleWebhook } = useContentPipeline();

  const [topic, setTopic] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["twitter"]);
  const [scheduleMode, setScheduleMode] = useState<"immediate" | "scheduled" | "draft">("draft");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  // Webhook form
  const [whDialogOpen, setWhDialogOpen] = useState(false);
  const [whName, setWhName] = useState("");
  const [whUrl, setWhUrl] = useState("");
  const [whPlatforms, setWhPlatforms] = useState<string[]>([]);

  const handleRun = async () => {
    if (!topic.trim() || selectedPlatforms.length === 0) return;
    setIsRunning(true);
    try {
      await runPipeline.mutateAsync({
        topic: topic.trim(),
        platforms: selectedPlatforms,
        scheduleMode,
        scheduledAt: scheduleMode === "scheduled" ? scheduledAt : undefined,
      });
      setTopic("");
    } finally {
      setIsRunning(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleAddWebhook = () => {
    if (!whName.trim() || !whUrl.trim()) return;
    addWebhook.mutate({ name: whName, url: whUrl, platforms: whPlatforms });
    setWhDialogOpen(false);
    setWhName("");
    setWhUrl("");
    setWhPlatforms([]);
  };

  const completedRuns = pipelineRuns.filter(r => r.status === "completed").length;
  const runningRuns = pipelineRuns.filter(r => r.status === "running").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-black tracking-tighter text-foreground">Content Pipeline</h1>
          <p className="text-muted-foreground">
            Automated content creation: idea → image → schedule → publish
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pipelineRuns.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{completedRuns}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Running</CardTitle>
              <Loader2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{runningRuns}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
              <Webhook className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webhooks.filter(w => w.isActive).length}</div>
              <p className="text-xs text-muted-foreground">Active endpoints</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="create" className="space-y-4">
          <TabsList>
            <TabsTrigger value="create">Create Pipeline</TabsTrigger>
            <TabsTrigger value="history">Run History</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* CREATE PIPELINE TAB */}
          <TabsContent value="create" className="space-y-4">
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Pipeline Form */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate Content
                  </CardTitle>
                  <CardDescription>
                    Describe your content topic and the pipeline will handle everything
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Topic */}
                  <div className="space-y-2">
                    <Label>Content Topic / Prompt</Label>
                    <Textarea
                      placeholder="e.g., 5 productivity tips for remote workers, a behind-the-scenes look at our latest product..."
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="min-h-[100px]"
                      disabled={isRunning}
                    />
                  </div>

                  {/* Platforms */}
                  <div className="space-y-2">
                    <Label>Target Platforms</Label>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORM_OPTIONS.map((p) => (
                        <Badge
                          key={p.value}
                          variant={selectedPlatforms.includes(p.value) ? "default" : "outline"}
                          className="cursor-pointer px-3 py-1.5"
                          onClick={() => !isRunning && togglePlatform(p.value)}
                        >
                          {p.label}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Mode */}
                  <div className="space-y-2">
                    <Label>After Generation</Label>
                    <Select value={scheduleMode} onValueChange={(v: any) => setScheduleMode(v)} disabled={isRunning}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">
                          <span className="flex items-center gap-2"><FileText className="h-3 w-3" /> Save as Draft</span>
                        </SelectItem>
                        <SelectItem value="scheduled">
                          <span className="flex items-center gap-2"><Calendar className="h-3 w-3" /> Schedule</span>
                        </SelectItem>
                        <SelectItem value="immediate">
                          <span className="flex items-center gap-2"><Send className="h-3 w-3" /> Publish via Webhooks</span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {scheduleMode === "scheduled" && (
                    <div className="space-y-2">
                      <Label>Schedule Date & Time</Label>
                      <Input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        disabled={isRunning}
                      />
                    </div>
                  )}

                  {/* Run Button */}
                  <Button
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleRun}
                    disabled={isRunning || !topic.trim() || selectedPlatforms.length === 0}
                  >
                    {isRunning ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Running Pipeline...
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4" />
                        Run Content Pipeline
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Pipeline Steps Visual */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm">Pipeline Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { icon: Sparkles, label: "1. AI Content Generation", desc: "Gemini creates optimized content" },
                      { icon: Image, label: "2. DALL-E Image Creation", desc: "Cover image auto-generated" },
                      { icon: Calendar, label: "3. Schedule / Save", desc: "Post saved to your CMS" },
                      { icon: Globe, label: "4. Webhook Publishing", desc: "Fire webhooks to distribute" },
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <step.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{step.label}</p>
                          <p className="text-xs text-muted-foreground">{step.desc}</p>
                        </div>
                        {i < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground ml-auto mt-2" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history" className="space-y-4">
            <ScrollArea className="h-[600px]">
              <div className="space-y-3">
                {pipelineRuns.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                      <Zap className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>No pipeline runs yet. Create your first one above!</p>
                    </CardContent>
                  </Card>
                ) : (
                  pipelineRuns.map((run) => (
                    <PipelineRunCard key={run.id} run={run} />
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* WEBHOOKS TAB */}
          <TabsContent value="webhooks" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Publish Webhooks</h3>
                <p className="text-sm text-muted-foreground">
                  Configure endpoints to receive post data when publishing (Zapier, Make, n8n, custom)
                </p>
              </div>
              <Dialog open={whDialogOpen} onOpenChange={setWhDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Webhook Endpoint</DialogTitle>
                    <DialogDescription>
                      This webhook will receive POST requests with content data when the pipeline publishes
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input placeholder="e.g., Zapier Hook, My API" value={whName} onChange={(e) => setWhName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Webhook URL</Label>
                      <Input placeholder="https://hooks.zapier.com/..." value={whUrl} onChange={(e) => setWhUrl(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Platforms (leave empty for all)</Label>
                      <div className="flex flex-wrap gap-2">
                        {PLATFORM_OPTIONS.map((p) => (
                          <Badge
                            key={p.value}
                            variant={whPlatforms.includes(p.value) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setWhPlatforms(prev =>
                              prev.includes(p.value) ? prev.filter(x => x !== p.value) : [...prev, p.value]
                            )}
                          >
                            {p.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setWhDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddWebhook} disabled={!whName.trim() || !whUrl.trim()}>Add Webhook</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-3">
              {webhooks.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <Webhook className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No webhooks configured. Add one to enable automated publishing.</p>
                  </CardContent>
                </Card>
              ) : (
                webhooks.map((wh) => (
                  <Card key={wh.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div className="flex items-center gap-3">
                        <Webhook className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{wh.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{wh.url}</p>
                          {wh.platforms.length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {wh.platforms.map(p => (
                                <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={wh.isActive}
                          onCheckedChange={() => toggleWebhook.mutate({ id: wh.id, isActive: wh.isActive })}
                        />
                        <Button variant="ghost" size="icon" onClick={() => deleteWebhook.mutate(wh.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

function PipelineRunCard({ run }: { run: PipelineRun }) {
  const [expanded, setExpanded] = useState(false);

  const progress = run.status === "completed" ? 100 : run.status === "running"
    ? Math.min(90, (run.steps.length / 7) * 100)
    : 0;

  return (
    <Card className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(run.status)}
            <div>
              <p className="font-medium">{run.topic}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(run.createdAt), "MMM d, yyyy HH:mm")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {run.platforms.map(p => (
              <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
            ))}
            <Badge variant={run.status === "completed" ? "default" : run.status === "running" ? "secondary" : "destructive"}>
              {run.status}
            </Badge>
          </div>
        </div>

        {run.status === "running" && (
          <Progress value={progress} className="mt-3 h-2" />
        )}

        {expanded && (
          <div className="mt-4 space-y-2 border-t pt-3">
            <p className="text-xs font-medium text-muted-foreground uppercase">Pipeline Steps</p>
            {run.steps.map((step, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span>{getStepLabel(step.step)}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {format(new Date(step.ts), "HH:mm:ss")}
                </span>
              </div>
            ))}
            {run.result && (
              <div className="mt-2 p-3 rounded-md bg-muted text-sm">
                <p><strong>Post:</strong> {run.result.title}</p>
                <p><strong>Image:</strong> {run.result.hasImage ? "Yes ✓" : "No"}</p>
                <p><strong>Status:</strong> {run.result.postStatus}</p>
              </div>
            )}
            {run.errorMessage && (
              <p className="text-sm text-destructive">{run.errorMessage}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
