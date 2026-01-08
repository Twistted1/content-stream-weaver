import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Play, Pause, Clock, Zap, RefreshCw, MoreHorizontal, Pencil, Trash2, History } from "lucide-react";
import { Automation, triggerOptions } from "./automationData";

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string) => void;
  onEdit: (automation: Automation) => void;
  onDelete: (id: string) => void;
  onRun: (id: string) => void;
  onViewHistory: (automation: Automation) => void;
}

export function AutomationCard({
  automation,
  onToggle,
  onEdit,
  onDelete,
  onRun,
  onViewHistory,
}: AutomationCardProps) {
  const triggerLabel = triggerOptions.find((t) => t.value === automation.trigger)?.label || automation.trigger;

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-lg ${
            automation.status === "active"
              ? "bg-emerald-500/20 text-emerald-500"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {automation.status === "active" ? (
            <Play className="h-4 w-4" />
          ) : (
            <Pause className="h-4 w-4" />
          )}
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-foreground">{automation.name}</h3>
            <Badge variant={automation.status === "active" ? "default" : "secondary"}>
              {automation.status}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{automation.description}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Trigger: {triggerLabel}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Last run: {automation.lastRun || "Never"}
            </span>
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              {automation.runs} runs
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {automation.platforms.slice(0, 3).map((platform) => (
            <Badge key={platform} variant="outline" className="text-xs">
              {platform}
            </Badge>
          ))}
          {automation.platforms.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{automation.platforms.length - 3}
            </Badge>
          )}
        </div>
        <Switch
          checked={automation.status === "active"}
          onCheckedChange={() => onToggle(automation.id)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onRun(automation.id)}>
              <Play className="h-4 w-4 mr-2" />
              Run Now
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewHistory(automation)}>
              <History className="h-4 w-4 mr-2" />
              View History
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(automation)}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(automation.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
