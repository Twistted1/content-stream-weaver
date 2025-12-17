import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Target,
  Plus,
  TrendingUp,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Strategy {
  id: string;
  name: string;
  description: string;
  status: "active" | "planning" | "completed" | "paused";
  progress: number;
  startDate: string;
  endDate: string;
  goals: number;
  completedGoals: number;
  assignees: string[];
  platforms: string[];
}

const strategies: Strategy[] = [
  {
    id: "1",
    name: "Q1 Brand Awareness Campaign",
    description: "Increase brand visibility across all social platforms",
    status: "active",
    progress: 65,
    startDate: "Jan 1, 2024",
    endDate: "Mar 31, 2024",
    goals: 8,
    completedGoals: 5,
    assignees: ["JD", "SM", "AK"],
    platforms: ["Instagram", "Twitter", "LinkedIn"],
  },
  {
    id: "2",
    name: "Product Launch Strategy",
    description: "Coordinated launch campaign for new product line",
    status: "planning",
    progress: 25,
    startDate: "Feb 15, 2024",
    endDate: "Apr 30, 2024",
    goals: 12,
    completedGoals: 3,
    assignees: ["SM", "RB"],
    platforms: ["Instagram", "YouTube", "TikTok"],
  },
  {
    id: "3",
    name: "Holiday Season Engagement",
    description: "Maximize engagement during holiday shopping season",
    status: "completed",
    progress: 100,
    startDate: "Nov 1, 2023",
    endDate: "Dec 31, 2023",
    goals: 10,
    completedGoals: 10,
    assignees: ["JD", "AK", "RB", "SM"],
    platforms: ["All Platforms"],
  },
  {
    id: "4",
    name: "Influencer Partnership Program",
    description: "Build relationships with micro-influencers in target niche",
    status: "active",
    progress: 40,
    startDate: "Jan 15, 2024",
    endDate: "Jun 30, 2024",
    goals: 6,
    completedGoals: 2,
    assignees: ["AK"],
    platforms: ["Instagram", "TikTok"],
  },
  {
    id: "5",
    name: "Content Repurposing Initiative",
    description: "Maximize content ROI by repurposing across channels",
    status: "paused",
    progress: 50,
    startDate: "Dec 1, 2023",
    endDate: "Feb 28, 2024",
    goals: 4,
    completedGoals: 2,
    assignees: ["RB", "SM"],
    platforms: ["YouTube", "LinkedIn", "Twitter"],
  },
];

const statusConfig = {
  active: { label: "Active", variant: "default" as const, icon: TrendingUp },
  planning: { label: "Planning", variant: "secondary" as const, icon: Clock },
  completed: { label: "Completed", variant: "outline" as const, icon: CheckCircle2 },
  paused: { label: "Paused", variant: "destructive" as const, icon: AlertCircle },
};

const Strategies = () => {
  const activeStrategies = strategies.filter((s) => s.status === "active").length;
  const totalGoals = strategies.reduce((acc, s) => acc + s.goals, 0);
  const completedGoals = strategies.reduce((acc, s) => acc + s.completedGoals, 0);
  const avgProgress = Math.round(
    strategies.reduce((acc, s) => acc + s.progress, 0) / strategies.length
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Strategies</h1>
            <p className="text-muted-foreground">
              Plan and track your content marketing strategies
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Strategy
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Strategies</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{strategies.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeStrategies} currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Goals Progress</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedGoals}/{totalGoals}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((completedGoals / totalGoals) * 100)}% completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg Progress</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgProgress}%</div>
              <Progress value={avgProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">
                Across all strategies
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Strategies Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Strategy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Timeline</TableHead>
                  <TableHead>Goals</TableHead>
                  <TableHead>Team</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strategies.map((strategy) => {
                  const StatusIcon = statusConfig[strategy.status].icon;
                  return (
                    <TableRow key={strategy.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{strategy.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {strategy.description}
                          </p>
                          <div className="flex gap-1 flex-wrap">
                            {strategy.platforms.map((platform) => (
                              <Badge
                                key={platform}
                                variant="outline"
                                className="text-xs"
                              >
                                {platform}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[strategy.status].variant}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig[strategy.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 w-24">
                          <div className="text-sm font-medium">
                            {strategy.progress}%
                          </div>
                          <Progress value={strategy.progress} className="h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {strategy.startDate} - {strategy.endDate}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {strategy.completedGoals}/{strategy.goals} completed
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {strategy.assignees.slice(0, 3).map((assignee, idx) => (
                            <div
                              key={idx}
                              className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground border-2 border-background"
                            >
                              {assignee}
                            </div>
                          ))}
                          {strategy.assignees.length > 3 && (
                            <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground border-2 border-background">
                              +{strategy.assignees.length - 3}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Strategy
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Strategies;
