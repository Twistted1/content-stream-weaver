import { useState } from "react";
import {
  Link2,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { toast } from "sonner";

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string;
  permissions: string[];
}

interface ConnectedApp {
  id: string;
  name: string;
  icon: string;
  description: string;
  connected: boolean;
  connectedAt?: string;
  status?: "active" | "expired" | "error";
}

const initialAPIKeys: APIKey[] = [
  {
    id: "1",
    name: "Production API Key",
    key: "sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "2025-11-15",
    lastUsed: "2 hours ago",
    permissions: ["read", "write"],
  },
  {
    id: "2",
    name: "Development API Key",
    key: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx",
    createdAt: "2025-12-01",
    lastUsed: "5 days ago",
    permissions: ["read"],
  },
];

const connectedApps: ConnectedApp[] = [
  {
    id: "twitter",
    name: "Twitter / X",
    icon: "𝕏",
    description: "Post and schedule tweets",
    connected: true,
    connectedAt: "2025-10-20",
    status: "active",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "f",
    description: "Manage pages and post content",
    connected: true,
    connectedAt: "2025-10-18",
    status: "active",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "📷",
    description: "Share photos and stories",
    connected: true,
    connectedAt: "2025-11-01",
    status: "active",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "in",
    description: "Connect to share professional content",
    connected: false,
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: "♪",
    description: "Short-form video content",
    connected: false,
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: "▶",
    description: "Video uploads and community posts",
    connected: false,
  },
];

export function IntegrationsSettings() {
  const [apiKeys, setAPIKeys] = useState<APIKey[]>(initialAPIKeys);
  const [apps, setApps] = useState<ConnectedApp[]>(connectedApps);
  const [showAPIKeyDialog, setShowAPIKeyDialog] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyForm, setNewKeyForm] = useState({
    name: "",
    permissions: "read",
  });

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleCreateAPIKey = () => {
    if (!newKeyForm.name) {
      toast.error("Please enter a name for the API key");
      return;
    }

    const newKey: APIKey = {
      id: Date.now().toString(),
      name: newKeyForm.name,
      key: `sk_${newKeyForm.permissions === "read" ? "test" : "live"}_${Math.random().toString(36).substring(2, 30)}`,
      createdAt: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      permissions: newKeyForm.permissions === "read" ? ["read"] : ["read", "write"],
    };

    setAPIKeys([...apiKeys, newKey]);
    setNewKeyForm({ name: "", permissions: "read" });
    setShowAPIKeyDialog(false);
    toast.success("API key created successfully");
  };

  const handleRevokeKey = (id: string) => {
    setAPIKeys(apiKeys.filter((key) => key.id !== id));
    toast.success("API key revoked");
  };

  const handleConnectApp = (id: string) => {
    setApps(
      apps.map((app) =>
        app.id === id
          ? { ...app, connected: true, connectedAt: new Date().toISOString().split("T")[0], status: "active" as const }
          : app
      )
    );
    toast.success("App connected successfully");
  };

  const handleDisconnectApp = (id: string) => {
    setApps(
      apps.map((app) =>
        app.id === id
          ? { ...app, connected: false, connectedAt: undefined, status: undefined }
          : app
      )
    );
    toast.success("App disconnected");
  };

  return (
    <div className="space-y-6">
      {/* API Keys */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage API keys for programmatic access to your account
              </CardDescription>
            </div>
            <Button onClick={() => setShowAPIKeyDialog(true)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Key
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{apiKey.name}</p>
                    <div className="flex gap-1">
                      {apiKey.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded">
                      {visibleKeys.has(apiKey.id)
                        ? apiKey.key
                        : apiKey.key.replace(/./g, "•").slice(0, 20) + "..."}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="h-3 w-3" />
                      ) : (
                        <Eye className="h-3 w-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(apiKey.key)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Created {apiKey.createdAt} • Last used {apiKey.lastUsed}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRevokeKey(apiKey.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Connected Apps */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Apps</CardTitle>
          <CardDescription>
            Manage your connected social media accounts and integrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apps.map((app, index) => (
              <div key={app.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg font-bold">
                      {app.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{app.name}</p>
                        {app.connected && app.status && (
                          <Badge
                            variant={app.status === "active" ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {app.status === "active" ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Connected
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3 mr-1" />
                                {app.status}
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{app.description}</p>
                      {app.connected && app.connectedAt && (
                        <p className="text-xs text-muted-foreground">
                          Connected on {app.connectedAt}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {app.connected ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info("Refreshing connection...")}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnectApp(app.id)}
                        >
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" onClick={() => handleConnectApp(app.id)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
                {index < apps.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <CardTitle>Webhooks</CardTitle>
          <CardDescription>
            Configure webhooks to receive real-time notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Webhooks</Label>
              <p className="text-sm text-muted-foreground">
                Receive HTTP callbacks when events occur
              </p>
            </div>
            <Switch onCheckedChange={(checked) => toast.success(checked ? "Webhooks enabled" : "Webhooks disabled")} />
          </div>
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <div className="flex gap-2">
              <Input placeholder="https://your-server.com/webhook" />
              <Button variant="outline">Test</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Create API Key Dialog */}
      <Dialog open={showAPIKeyDialog} onOpenChange={setShowAPIKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for programmatic access
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="e.g., Production API Key"
                value={newKeyForm.name}
                onChange={(e) =>
                  setNewKeyForm({ ...newKeyForm, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="permissions">Permissions</Label>
              <Select
                value={newKeyForm.permissions}
                onValueChange={(value) =>
                  setNewKeyForm({ ...newKeyForm, permissions: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read">Read only</SelectItem>
                  <SelectItem value="write">Read & Write</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAPIKeyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateAPIKey}>Create Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
