import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export function StatsCard({ title, value, change, changeType, icon: Icon, iconColor }: StatsCardProps) {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", iconColor || "bg-primary/20")}>
          <Icon className={cn("h-5 w-5", iconColor ? "text-foreground" : "text-primary")} />
        </div>
        <span className="text-sm text-muted-foreground font-medium">{title}</span>
      </div>
      <p className="text-3xl font-bold text-foreground mb-1">{value}</p>
      <p className={cn(
        "text-sm font-medium",
        changeType === "positive" && "text-[hsl(var(--success))]",
        changeType === "negative" && "text-destructive",
        changeType === "neutral" && "text-muted-foreground"
      )}>
        {change}
      </p>
    </div>
  );
}
