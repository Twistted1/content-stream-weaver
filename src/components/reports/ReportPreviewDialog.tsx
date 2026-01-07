import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Printer, Share2 } from "lucide-react";
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
} from "recharts";
import { Report } from "./ReportCard";

interface ReportPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  report: Report | null;
}

const mockChartData = [
  { month: "Jan", value: 4000, target: 3500 },
  { month: "Feb", value: 3000, target: 3500 },
  { month: "Mar", value: 5000, target: 4000 },
  { month: "Apr", value: 4780, target: 4000 },
  { month: "May", value: 5890, target: 4500 },
  { month: "Jun", value: 6390, target: 5000 },
];

const mockBarData = [
  { category: "Product A", sales: 4200 },
  { category: "Product B", sales: 3800 },
  { category: "Product C", sales: 2900 },
  { category: "Product D", sales: 2400 },
  { category: "Product E", sales: 1800 },
];

const mockTableData = [
  { metric: "Total Revenue", current: "$125,400", previous: "$112,300", change: "+11.7%" },
  { metric: "New Customers", current: "1,247", previous: "1,089", change: "+14.5%" },
  { metric: "Conversion Rate", current: "3.24%", previous: "2.98%", change: "+8.7%" },
  { metric: "Avg Order Value", current: "$89.50", previous: "$82.30", change: "+8.7%" },
];

export function ReportPreviewDialog({
  open,
  onOpenChange,
  report,
}: ReportPreviewDialogProps) {
  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl">{report.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Generated: {report.lastGenerated}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download {report.format}
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Executive Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This {report.type.toLowerCase()} report provides a comprehensive overview of key metrics
                and performance indicators for the reporting period. Overall trends show positive
                growth with notable improvements in conversion rates and customer acquisition.
              </p>
            </CardContent>
          </Card>

          {/* Key Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 font-medium">Metric</th>
                      <th className="text-right py-2 font-medium">Current Period</th>
                      <th className="text-right py-2 font-medium">Previous Period</th>
                      <th className="text-right py-2 font-medium">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockTableData.map((row) => (
                      <tr key={row.metric} className="border-b border-border last:border-0">
                        <td className="py-2">{row.metric}</td>
                        <td className="text-right py-2 font-medium">{row.current}</td>
                        <td className="text-right py-2 text-muted-foreground">{row.previous}</td>
                        <td className="text-right py-2">
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            {row.change}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Performance Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fillOpacity={1}
                      fill="url(#colorValue)"
                      name="Actual"
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="5 5"
                      fill="none"
                      name="Target"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockBarData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis type="number" className="text-xs" />
                    <YAxis dataKey="category" type="category" width={80} className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
