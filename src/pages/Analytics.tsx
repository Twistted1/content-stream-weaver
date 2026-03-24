import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/LoadingState";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Eye, 
  Clock, 
  MousePointerClick,
  ArrowUpRight,
  Download,
  Calendar,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from "recharts";
import { toast } from "sonner";

const trafficByPeriod: Record<string, { name: string; visitors: number; pageViews: number }[]> = {
  "7d": [
    { name: "Mon", visitors: 1200, pageViews: 1900 },
    { name: "Tue", visitors: 980, pageViews: 1500 },
    { name: "Wed", visitors: 1400, pageViews: 2100 },
    { name: "Thu", visitors: 1100, pageViews: 1700 },
    { name: "Fri", visitors: 1350, pageViews: 2000 },
    { name: "Sat", visitors: 800, pageViews: 1200 },
    { name: "Sun", visitors: 650, pageViews: 950 },
  ],
  "30d": [
    { name: "Week 1", visitors: 5200, pageViews: 8100 },
    { name: "Week 2", visitors: 6100, pageViews: 9400 },
    { name: "Week 3", visitors: 5800, pageViews: 8900 },
    { name: "Week 4", visitors: 7100, pageViews: 10800 },
  ],
  "90d": [
    { name: "Jan", visitors: 4000, pageViews: 6400 },
    { name: "Feb", visitors: 3000, pageViews: 4398 },
    { name: "Mar", visitors: 5000, pageViews: 7800 },
    { name: "Apr", visitors: 4780, pageViews: 6908 },
    { name: "May", visitors: 5890, pageViews: 8800 },
    { name: "Jun", visitors: 6390, pageViews: 9800 },
  ],
  "1y": [
    { name: "Jan", visitors: 4000, pageViews: 6400 },
    { name: "Feb", visitors: 3000, pageViews: 4398 },
    { name: "Mar", visitors: 5000, pageViews: 7800 },
    { name: "Apr", visitors: 4780, pageViews: 6908 },
    { name: "May", visitors: 5890, pageViews: 8800 },
    { name: "Jun", visitors: 6390, pageViews: 9800 },
    { name: "Jul", visitors: 7490, pageViews: 10300 },
    { name: "Aug", visitors: 6800, pageViews: 9500 },
    { name: "Sep", visitors: 7200, pageViews: 10100 },
    { name: "Oct", visitors: 7800, pageViews: 11200 },
    { name: "Nov", visitors: 8100, pageViews: 11900 },
    { name: "Dec", visitors: 8900, pageViews: 12800 },
  ],
};

const statsByPeriod: Record<string, { title: string; value: string; change: string; trend: "up" | "down"; icon: typeof Users }[]> = {
  "7d": [
    { title: "Total Visitors", value: "7,480", change: "+5.2%", trend: "up", icon: Users },
    { title: "Page Views", value: "11,350", change: "+3.1%", trend: "up", icon: Eye },
    { title: "Avg. Session Duration", value: "2m 58s", change: "-1.4%", trend: "down", icon: Clock },
    { title: "Conversion Rate", value: "2.91%", change: "+0.3%", trend: "up", icon: MousePointerClick },
  ],
  "30d": [
    { title: "Total Visitors", value: "24,200", change: "+9.8%", trend: "up", icon: Users },
    { title: "Page Views", value: "37,200", change: "+6.5%", trend: "up", icon: Eye },
    { title: "Avg. Session Duration", value: "3m 15s", change: "+0.5%", trend: "up", icon: Clock },
    { title: "Conversion Rate", value: "3.10%", change: "+0.6%", trend: "up", icon: MousePointerClick },
  ],
  "90d": [
    { title: "Total Visitors", value: "45,231", change: "+12.5%", trend: "up", icon: Users },
    { title: "Page Views", value: "128,459", change: "+8.2%", trend: "up", icon: Eye },
    { title: "Avg. Session Duration", value: "3m 42s", change: "-2.1%", trend: "down", icon: Clock },
    { title: "Conversion Rate", value: "3.24%", change: "+0.8%", trend: "up", icon: MousePointerClick },
  ],
  "1y": [
    { title: "Total Visitors", value: "182,400", change: "+22.1%", trend: "up", icon: Users },
    { title: "Page Views", value: "498,100", change: "+18.4%", trend: "up", icon: Eye },
    { title: "Avg. Session Duration", value: "3m 28s", change: "+4.2%", trend: "up", icon: Clock },
    { title: "Conversion Rate", value: "3.45%", change: "+1.2%", trend: "up", icon: MousePointerClick },
  ],
};

const deviceData = [
  { name: "Desktop", value: 55, color: "hsl(var(--primary))" },
  { name: "Mobile", value: 35, color: "hsl(var(--chart-2))" },
  { name: "Tablet", value: 10, color: "hsl(var(--chart-3))" },
];

const sourceData = [
  { source: "Organic Search", visits: 4500, conversion: 3.2 },
  { source: "Direct", visits: 3200, conversion: 4.1 },
  { source: "Social Media", visits: 2800, conversion: 2.8 },
  { source: "Referral", visits: 1900, conversion: 3.5 },
  { source: "Email", visits: 1200, conversion: 5.2 },
];

const engagementData = [
  { day: "Mon", sessions: 320, bounceRate: 42 },
  { day: "Tue", sessions: 450, bounceRate: 38 },
  { day: "Wed", sessions: 380, bounceRate: 45 },
  { day: "Thu", sessions: 520, bounceRate: 35 },
  { day: "Fri", sessions: 480, bounceRate: 40 },
  { day: "Sat", sessions: 280, bounceRate: 48 },
  { day: "Sun", sessions: 220, bounceRate: 52 },
];

const topPages = [
  { page: "/home", views: 12500, avgTime: "2:34", bounceRate: "32%" },
  { page: "/products", views: 8900, avgTime: "3:12", bounceRate: "28%" },
  { page: "/blog", views: 6700, avgTime: "4:45", bounceRate: "22%" },
  { page: "/about", views: 4200, avgTime: "1:58", bounceRate: "45%" },
  { page: "/contact", views: 2100, avgTime: "1:22", bounceRate: "38%" },
];

function exportAnalyticsCSV(period: string, stats: typeof statsByPeriod["7d"], trafficData: typeof trafficByPeriod["7d"]) {
  let csv = "Analytics Report\nPeriod," + period + "\n\n";
  csv += "Metric,Value,Change\n";
  stats.forEach(s => { csv += `${s.title},${s.value},${s.change}\n`; });
  csv += "\nTraffic Data\nPeriod,Visitors,Page Views\n";
  trafficData.forEach(t => { csv += `${t.name},${t.visitors},${t.pageViews}\n`; });
  csv += "\nTop Pages\nPage,Views,Avg Time,Bounce Rate\n";
  topPages.forEach(p => { csv += `${p.page},${p.views},${p.avgTime},${p.bounceRate}\n`; });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `analytics-${period}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Analytics() {
  const [isLoading, setIsLoading] = useState(false);
  const [period, setPeriod] = useState("30d");
  const [hasData] = useState(true);

  const trafficData = useMemo(() => trafficByPeriod[period] || trafficByPeriod["30d"], [period]);
  const stats = useMemo(() => statsByPeriod[period] || statsByPeriod["30d"], [period]);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Analytics data refreshed");
    }, 1500);
  };

  const handleExport = () => {
    exportAnalyticsCSV(period, stats, trafficData);
    toast.success("Analytics report exported as CSV");
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <LoadingState message="Loading analytics data..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tighter text-foreground leading-none">Analytics</h1>
            <p className="text-muted-foreground">
              Track your website performance and user engagement
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <Calendar className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {!hasData ? (
          <Card>
            <CardContent>
              <EmptyState
                icon={BarChart3}
                title="No analytics data yet"
                description="Analytics will appear here once your content starts getting views and engagement."
              />
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs">
                      {stat.trend === "up" ? (
                        <TrendingUp className="mr-1 h-3 w-3 text-chart-2" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3 text-destructive" />
                      )}
                      <span className={stat.trend === "up" ? "text-chart-2" : "text-destructive"}>
                        {stat.change}
                      </span>
                      <span className="ml-1 text-muted-foreground">vs last period</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="traffic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="sources">Sources</TabsTrigger>
              </TabsList>

              <TabsContent value="traffic" className="space-y-4">
                <div className="grid gap-4 lg:grid-cols-3">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Traffic Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trafficData}>
                            <defs>
                              <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="name" className="text-xs" />
                            <YAxis className="text-xs" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: "hsl(var(--card))", 
                                border: "1px solid hsl(var(--border))",
                                borderRadius: "8px"
                              }} 
                            />
                            <Area
                              type="monotone"
                              dataKey="visitors"
                              stroke="hsl(var(--primary))"
                              fillOpacity={1}
                              fill="url(#colorVisitors)"
                            />
                            <Area
                              type="monotone"
                              dataKey="pageViews"
                              stroke="hsl(var(--chart-2))"
                              fillOpacity={1}
                              fill="url(#colorPageViews)"
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Device Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[200px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={deviceData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {deviceData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="mt-4 space-y-2">
                        {deviceData.map((device) => (
                          <div key={device.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: device.color } as React.CSSProperties}
                              />
                              <span className="text-sm">{device.name}</span>
                            </div>
                            <span className="text-sm font-medium">{device.value}%</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Engagement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={engagementData}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="day" className="text-xs" />
                          <YAxis yAxisId="left" className="text-xs" />
                          <YAxis yAxisId="right" orientation="right" className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }} 
                          />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="sessions"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--primary))" }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="bounceRate"
                            stroke="hsl(var(--destructive))"
                            strokeWidth={2}
                            dot={{ fill: "hsl(var(--destructive))" }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="sources" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sourceData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis type="number" className="text-xs" />
                          <YAxis dataKey="source" type="category" width={100} className="text-xs" />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "8px"
                            }} 
                          />
                          <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Top Pages Table */}
            <Card>
              <CardHeader>
                <CardTitle>Top Pages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-left text-sm text-muted-foreground">
                        <th className="pb-3 font-medium">Page</th>
                        <th className="pb-3 font-medium">Views</th>
                        <th className="pb-3 font-medium">Avg. Time</th>
                        <th className="pb-3 font-medium">Bounce Rate</th>
                        <th className="pb-3 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPages.map((page) => (
                        <tr key={page.page} className="border-b border-border last:border-0">
                          <td className="py-3">
                            <span className="font-medium">{page.page}</span>
                          </td>
                          <td className="py-3">{page.views.toLocaleString()}</td>
                          <td className="py-3">{page.avgTime}</td>
                          <td className="py-3">
                            <Badge variant="secondary">{page.bounceRate}</Badge>
                          </td>
                          <td className="py-3">
                            <Button variant="ghost" size="sm">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
