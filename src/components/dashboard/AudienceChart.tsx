import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const data = [
  { day: "Mon", audience: 380, engagement: 240 },
  { day: "Tue", audience: 320, engagement: 180 },
  { day: "Wed", audience: 280, engagement: 220 },
  { day: "Thu", audience: 250, engagement: 190 },
  { day: "Fri", audience: 230, engagement: 160 },
  { day: "Sat", audience: 260, engagement: 210 },
  { day: "Sun", audience: 350, engagement: 280 },
];

const colors = [
  "hsl(var(--chart-2))",
  "hsl(var(--success))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-1))",
  "hsl(var(--warning))",
  "hsl(var(--chart-5))",
];

export function AudienceChart() {
  const [activeTab, setActiveTab] = useState<"audience" | "engagement">("audience");

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Audience & Engagement</h3>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          Last 7 days
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("audience")}
          className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
            activeTab === "audience"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Audience
        </button>
        <button
          onClick={() => setActiveTab("engagement")}
          className={`text-sm font-medium pb-2 border-b-2 transition-colors ${
            activeTab === "engagement"
              ? "text-primary border-primary"
              : "text-muted-foreground border-transparent hover:text-foreground"
          }`}
        >
          Engagement
        </button>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={40}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
            />
            <Bar
              dataKey={activeTab}
              radius={[6, 6, 0, 0]}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
