import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Strategy, StrategyStatus, platformOptions, teamMemberOptions } from "./strategiesData";

interface StrategyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  strategy?: Strategy | null;
  onSave: (data: Omit<Strategy, "id" | "createdAt">) => void;
}

export function StrategyDialog({ open, onOpenChange, strategy, onSave }: StrategyDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "planning" as StrategyStatus,
    progress: 0,
    startDate: "",
    endDate: "",
    goals: 1,
    completedGoals: 0,
    assignees: [] as string[],
    platforms: [] as string[],
  });

  useEffect(() => {
    if (strategy) {
      setFormData({
        name: strategy.name,
        description: strategy.description,
        status: strategy.status,
        progress: strategy.progress,
        startDate: strategy.startDate,
        endDate: strategy.endDate,
        goals: strategy.goals,
        completedGoals: strategy.completedGoals,
        assignees: strategy.assignees,
        platforms: strategy.platforms,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        status: "planning",
        progress: 0,
        startDate: "",
        endDate: "",
        goals: 1,
        completedGoals: 0,
        assignees: [],
        platforms: [],
      });
    }
  }, [strategy, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
  };

  const toggleAssignee = (initials: string) => {
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(initials)
        ? prev.assignees.filter((a) => a !== initials)
        : [...prev.assignees, initials],
    }));
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{strategy ? "Edit Strategy" : "New Strategy"}</DialogTitle>
          <DialogDescription>
            {strategy ? "Update strategy details" : "Create a new marketing strategy"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Strategy Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter strategy name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the strategy objectives"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: StrategyStatus) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  placeholder="Jan 1, 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  placeholder="Mar 31, 2024"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goals">Total Goals</Label>
                <Input
                  id="goals"
                  type="number"
                  min={1}
                  value={formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completedGoals">Completed Goals</Label>
                <Input
                  id="completedGoals"
                  type="number"
                  min={0}
                  max={formData.goals}
                  value={formData.completedGoals}
                  onChange={(e) => setFormData({ ...formData, completedGoals: Number(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Platforms</Label>
              <div className="flex flex-wrap gap-2">
                {platformOptions.map((platform) => (
                  <Badge
                    key={platform}
                    variant={formData.platforms.includes(platform) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => togglePlatform(platform)}
                  >
                    {platform}
                    {formData.platforms.includes(platform) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Team Members</Label>
              <div className="flex flex-wrap gap-2">
                {teamMemberOptions.map((member) => (
                  <Badge
                    key={member.initials}
                    variant={formData.assignees.includes(member.initials) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleAssignee(member.initials)}
                  >
                    {member.initials} - {member.name}
                    {formData.assignees.includes(member.initials) && (
                      <X className="h-3 w-3 ml-1" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {strategy ? "Save Changes" : "Create Strategy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
