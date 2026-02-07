import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const dataByPeriod: Record<string, { day: string; audience: number; engagement: number }[]> = {
  "7d": [
    { day: "Mon", audience: 380, engagement: 240 },
    { day: "Tue", audience: 320, engagement: 180 },
    { day: "Wed", audience: 280, engagement: 220 },
    { day: "Thu", audience: 250, engagement: 190 },
    { day: "Fri", audience: 230, engagement: 160 },
    { day: "Sat", audience: 260, engagement: 210 },
    { day: "Sun", audience: 350, engagement: 280 },
  ],
  "30d": [
    { day: "Week 1", audience: 1800, engagement: 1100 },
    { day: "Week 2", audience: 2100, engagement: 1400 },
    { day: "Week 3", audience: 1950, engagement: 1250 },
    { day: "Week 4", audience: 2400, engagement: 1600 },
  ],
  "90d": [
    { day: "Month 1", audience: 7200, engagement: 4400 },
    { day: "Month 2", audience: 8500, engagement: 5200 },
    { day: "Month 3", audience: 9100, engagement: 5800 },
  ],
};

const periodLabels: Record<string, string> = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "90d": "Last 90 days",
};

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
  const [period, setPeriod] = useState("7d");

  const data = dataByPeriod[period];

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Audience & Engagement</h3>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[140px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(periodLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
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
