import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Filter,
  ZoomIn,
  ZoomOut,
  Download
} from "lucide-react";

interface Task {
  id: number;
  name: string;
  project: string;
  assignee: { name: string; avatar: string };
  startDate: number;
  duration: number;
  progress: number;
  status: "completed" | "in-progress" | "pending" | "delayed";
  dependencies?: number[];
}

const tasks: Task[] = [
  {
    id: 1,
    name: "Project Planning",
    project: "Website Redesign",
    assignee: { name: "John D.", avatar: "" },
    startDate: 0,
    duration: 5,
    progress: 100,
    status: "completed",
  },
  {
    id: 2,
    name: "UI/UX Design",
    project: "Website Redesign",
    assignee: { name: "Sarah M.", avatar: "" },
    startDate: 3,
    duration: 8,
    progress: 75,
    status: "in-progress",
    dependencies: [1],
  },
  {
    id: 3,
    name: "Frontend Development",
    project: "Website Redesign",
    assignee: { name: "Mike R.", avatar: "" },
    startDate: 8,
    duration: 12,
    progress: 30,
    status: "in-progress",
    dependencies: [2],
  },
  {
    id: 4,
    name: "Backend Integration",
    project: "Website Redesign",
    assignee: { name: "Emily K.", avatar: "" },
    startDate: 12,
    duration: 10,
    progress: 0,
    status: "pending",
    dependencies: [3],
  },
  {
    id: 5,
    name: "Content Migration",
    project: "Website Redesign",
    assignee: { name: "Alex T.", avatar: "" },
    startDate: 6,
    duration: 6,
    progress: 50,
    status: "in-progress",
  },
  {
    id: 6,
    name: "Market Research",
    project: "Product Launch",
    assignee: { name: "Lisa W.", avatar: "" },
    startDate: 0,
    duration: 7,
    progress: 100,
    status: "completed",
  },
  {
    id: 7,
    name: "Marketing Campaign",
    project: "Product Launch",
    assignee: { name: "David C.", avatar: "" },
    startDate: 5,
    duration: 14,
    progress: 20,
    status: "delayed",
    dependencies: [6],
  },
  {
    id: 8,
    name: "Quality Assurance",
    project: "Website Redesign",
    assignee: { name: "Tom H.", avatar: "" },
    startDate: 18,
    duration: 5,
    progress: 0,
    status: "pending",
    dependencies: [3, 4],
  },
];

const days = Array.from({ length: 30 }, (_, i) => i + 1);
const dayWidth = 40;

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500";
    case "in-progress":
      return "bg-primary";
    case "pending":
      return "bg-muted-foreground";
    case "delayed":
      return "bg-destructive";
    default:
      return "bg-muted";
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-500";
    case "in-progress":
      return "bg-primary/10 text-primary";
    case "pending":
      return "bg-muted text-muted-foreground";
    case "delayed":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function GanttChart() {
  const [currentMonth] = useState("January 2024");
  const [selectedProject, setSelectedProject] = useState("all");

  const filteredTasks = selectedProject === "all" 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  const projects = [...new Set(tasks.map(t => t.project))];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gantt Chart</h1>
            <p className="text-muted-foreground">
              Visualize project timelines and dependencies
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">{currentMonth}</span>
            </div>
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedProject} onValueChange={setSelectedProject}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projects.map(project => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Gantt Chart */}
        <Card>
          <CardContent className="p-0">
            <div className="flex">
              {/* Task List */}
              <div className="w-[320px] shrink-0 border-r border-border">
                <div className="h-12 border-b border-border px-4 flex items-center bg-muted/50">
                  <span className="font-medium text-sm">Tasks</span>
                </div>
                <div className="divide-y divide-border">
                  {filteredTasks.map((task) => (
                    <div key={task.id} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={task.assignee.avatar} />
                          <AvatarFallback className="text-xs">
                            {task.assignee.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{task.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{task.project}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <Badge variant="secondary" className={`text-xs ${getStatusBadge(task.status)}`}>
                              {task.status}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{task.progress}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <ScrollArea className="flex-1">
                <div className="min-w-max">
                  {/* Days Header */}
                  <div className="h-12 border-b border-border flex bg-muted/50">
                    {days.map((day) => (
                      <div
                        key={day}
                        className="flex items-center justify-center border-r border-border text-sm text-muted-foreground"
                        style={{ width: dayWidth }}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Task Bars */}
                  <div className="divide-y divide-border">
                    {filteredTasks.map((task) => (
                      <div
                        key={task.id}
                        className="relative h-[72px] hover:bg-muted/30 transition-colors"
                        style={{ width: days.length * dayWidth }}
                      >
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex">
                          {days.map((day) => (
                            <div
                              key={day}
                              className="border-r border-border/50"
                              style={{ width: dayWidth }}
                            />
                          ))}
                        </div>

                        {/* Task Bar */}
                        <div
                          className="absolute top-4 h-10 rounded-md flex items-center overflow-hidden cursor-pointer group"
                          style={{
                            left: task.startDate * dayWidth + 4,
                            width: task.duration * dayWidth - 8,
                          }}
                        >
                          {/* Background */}
                          <div className={`absolute inset-0 ${getStatusColor(task.status)} opacity-20`} />
                          
                          {/* Progress Fill */}
                          <div
                            className={`absolute inset-y-0 left-0 ${getStatusColor(task.status)}`}
                            style={{ width: `${task.progress}%` }}
                          />

                          {/* Border */}
                          <div className={`absolute inset-0 border-2 rounded-md ${getStatusColor(task.status).replace('bg-', 'border-')}`} />

                          {/* Label */}
                          <span className="relative z-10 px-2 text-xs font-medium truncate text-foreground">
                            {task.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Legend & Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredTasks.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {filteredTasks.filter(t => t.status === "completed").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {filteredTasks.filter(t => t.status === "in-progress").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Delayed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {filteredTasks.filter(t => t.status === "delayed").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Legend */}
        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-sm font-medium">Legend:</span>
              <div className="flex items-center gap-2">
                <div className="h-3 w-8 rounded bg-green-500" />
                <span className="text-sm text-muted-foreground">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-8 rounded bg-primary" />
                <span className="text-sm text-muted-foreground">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-8 rounded bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-8 rounded bg-destructive" />
                <span className="text-sm text-muted-foreground">Delayed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
