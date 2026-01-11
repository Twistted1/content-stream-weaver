import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Target, Users } from "lucide-react";
import { Strategy, statusConfig } from "./strategiesData";

interface StrategyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: Strategy | null;
}

export function StrategyDetailDialog({ open, onOpenChange, strategy }: StrategyDetailDialogProps) {
  if (!strategy) return null;

  const StatusIcon = statusConfig[strategy.status].icon;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{strategy.name}</DialogTitle>
          <DialogDescription>{strategy.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig[strategy.status].variant}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[strategy.status].label}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{strategy.progress}%</span>
            </div>
            <Progress value={strategy.progress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Timeline
              </div>
              <p className="text-sm font-medium">
                {strategy.startDate} - {strategy.endDate}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Goals
              </div>
              <p className="text-sm font-medium">
                {strategy.completedGoals} / {strategy.goals} completed
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Team Members
            </div>
            <div className="flex -space-x-2">
              {strategy.assignees.map((assignee, idx) => (
                <div
                  key={idx}
                  className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground border-2 border-background"
                  title={assignee}
                >
                  {assignee}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Platforms</p>
            <div className="flex flex-wrap gap-2">
              {strategy.platforms.map((platform) => (
                <Badge key={platform} variant="outline">
                  {platform}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
