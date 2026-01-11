import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Target, Users } from "lucide-react";
import { Strategy, statusConfig } from "./strategiesData";
import { useAppStore } from "@/stores/useAppStore";

interface StrategyDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy: Strategy | null;
}

export function StrategyDetailDialog({ open, onOpenChange, strategy }: StrategyDetailDialogProps) {
  const { toggleStrategyGoal, strategies } = useAppStore();
  
  // Get fresh strategy data from store
  const currentStrategy = strategy ? strategies.find(s => s.id === strategy.id) : null;
  
  if (!currentStrategy) return null;

  const StatusIcon = statusConfig[currentStrategy.status].icon;
  const completedGoals = currentStrategy.goalItems.filter(g => g.completed).length;
  const totalGoals = currentStrategy.goalItems.length;

  const handleToggleGoal = (goalId: string) => {
    toggleStrategyGoal(currentStrategy.id, goalId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{currentStrategy.name}</DialogTitle>
          <DialogDescription>{currentStrategy.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig[currentStrategy.status].variant}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[currentStrategy.status].label}
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{currentStrategy.progress}%</span>
            </div>
            <Progress value={currentStrategy.progress} className="h-3" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                Timeline
              </div>
              <p className="text-sm font-medium">
                {currentStrategy.startDate} - {currentStrategy.endDate}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Target className="h-4 w-4" />
                Goals
              </div>
              <p className="text-sm font-medium">
                {completedGoals} / {totalGoals} completed
              </p>
            </div>
          </div>

          {/* Goal Items */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Goal Checklist</p>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {currentStrategy.goalItems.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center gap-3 p-2 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <Checkbox
                    id={goal.id}
                    checked={goal.completed}
                    onCheckedChange={() => handleToggleGoal(goal.id)}
                  />
                  <label
                    htmlFor={goal.id}
                    className={`flex-1 text-sm cursor-pointer ${
                      goal.completed ? "line-through text-muted-foreground" : ""
                    }`}
                  >
                    {goal.title}
                  </label>
                </div>
              ))}
              {currentStrategy.goalItems.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No goals defined for this strategy
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Team Members
            </div>
            <div className="flex -space-x-2">
              {currentStrategy.assignees.map((assignee, idx) => (
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
              {currentStrategy.platforms.map((platform) => (
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
