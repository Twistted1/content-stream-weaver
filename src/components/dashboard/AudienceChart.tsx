import { useMemo } from "react";
import { usePosts } from "@/hooks/usePosts";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from "recharts";
import { format, subDays, subWeeks, subMonths } from "date-fns";

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
  const { posts } = usePosts();

  const data = useMemo(() => {
    if (!posts || posts.length === 0) return [];

    const now = new Date();
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const day = subDays(now, i);
      const dayStr = format(day, "EEE");
      const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
      const dayEnd = new Date(dayStart.getTime() + 86400000);

      const dayPosts = posts.filter(p => {
        const created = new Date(p.createdAt);
        return created >= dayStart && created < dayEnd;
      });

      result.push({
        day: dayStr,
        posts: dayPosts.length,
        published: dayPosts.filter(p => p.status === "published").length,
      });
    }

    return result;
  }, [posts]);

  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Posts Activity (Last 7 Days)</h3>
      </div>

      <div className="h-64">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            No post activity yet
          </div>
        ) : (
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
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
                labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: "0.25rem" }}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.2 }}
              />
              <Bar dataKey="posts" name="Total Posts" radius={[6, 6, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
