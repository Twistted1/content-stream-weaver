import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  MessageSquare,
  Paperclip,
  Filter,
  Search,
  LayoutGrid,
  List,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ProjectStatus = "backlog" | "in-progress" | "review" | "completed";

interface Project {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: "low" | "medium" | "high";
  dueDate: string;
  progress: number;
  comments: number;
  attachments: number;
  assignees: { name: string; avatar?: string }[];
  tags: string[];
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: "Q4 Marketing Campaign",
    description: "Plan and execute holiday marketing campaign across all platforms",
    status: "in-progress",
    priority: "high",
    dueDate: "Dec 20, 2025",
    progress: 65,
    comments: 12,
    attachments: 5,
    assignees: [
      { name: "Alice Johnson" },
      { name: "Bob Smith" },
    ],
    tags: ["Marketing", "Social Media"],
  },
  {
    id: 2,
    title: "Website Redesign Content",
    description: "Create all copy and visuals for the new website launch",
    status: "in-progress",
    priority: "high",
    dueDate: "Dec 15, 2025",
    progress: 40,
    comments: 8,
    attachments: 12,
    assignees: [
      { name: "Carol Davis" },
    ],
    tags: ["Website", "Design"],
  },
  {
    id: 3,
    title: "Product Launch Video",
    description: "Script and produce launch video for new product line",
    status: "review",
    priority: "medium",
    dueDate: "Dec 18, 2025",
    progress: 90,
    comments: 15,
    attachments: 8,
    assignees: [
      { name: "David Lee" },
      { name: "Eve Wilson" },
    ],
    tags: ["Video", "Product"],
  },
  {
    id: 4,
    title: "Blog Content Series",
    description: "Write 10-part blog series on industry trends",
    status: "backlog",
    priority: "low",
    dueDate: "Jan 10, 2026",
    progress: 10,
    comments: 3,
    attachments: 2,
    assignees: [
      { name: "Frank Miller" },
    ],
    tags: ["Blog", "SEO"],
  },
  {
    id: 5,
    title: "Social Media Templates",
    description: "Design reusable templates for Instagram and TikTok",
    status: "backlog",
    priority: "medium",
    dueDate: "Dec 30, 2025",
    progress: 0,
    comments: 2,
    attachments: 0,
    assignees: [
      { name: "Grace Taylor" },
    ],
    tags: ["Design", "Social Media"],
  },
  {
    id: 6,
    title: "Email Newsletter Redesign",
    description: "Refresh email templates and newsletter layout",
    status: "completed",
    priority: "medium",
    dueDate: "Dec 10, 2025",
    progress: 100,
    comments: 20,
    attachments: 6,
    assignees: [
      { name: "Henry Brown" },
      { name: "Ivy Chen" },
    ],
    tags: ["Email", "Design"],
  },
  {
    id: 7,
    title: "Influencer Collaboration",
    description: "Coordinate content with partner influencers",
    status: "review",
    priority: "high",
    dueDate: "Dec 22, 2025",
    progress: 75,
    comments: 25,
    attachments: 10,
    assignees: [
      { name: "Jack White" },
    ],
    tags: ["Influencer", "Partnership"],
  },
  {
    id: 8,
    title: "Annual Report Graphics",
    description: "Create infographics and charts for annual report",
    status: "completed",
    priority: "low",
    dueDate: "Dec 5, 2025",
    progress: 100,
    comments: 8,
    attachments: 15,
    assignees: [
      { name: "Karen Green" },
    ],
    tags: ["Design", "Corporate"],
  },
];

const columns: { id: ProjectStatus; title: string; color: string }[] = [
  { id: "backlog", title: "Backlog", color: "bg-muted" },
  { id: "in-progress", title: "In Progress", color: "bg-primary/20" },
  { id: "review", title: "In Review", color: "bg-warning/20" },
  { id: "completed", title: "Completed", color: "bg-success/20" },
];

const priorityColors = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-warning/20 text-warning-foreground",
  high: "bg-destructive/20 text-destructive",
};

function ProjectCard({ project, onDragStart }: { project: Project; onDragStart: (id: number) => void }) {
  return (
    <Card
      draggable
      onDragStart={() => onDragStart(project.id)}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex flex-wrap gap-1">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div>
          <h4 className="font-medium text-sm">{project.title}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {project.dueDate}
            </span>
            <Badge className={priorityColors[project.priority]} variant="secondary">
              {project.priority}
            </Badge>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            {project.assignees.slice(0, 3).map((assignee, i) => (
              <Avatar key={i} className="h-6 w-6 border-2 border-background">
                <AvatarImage src={assignee.avatar} />
                <AvatarFallback className="text-xs">
                  {assignee.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
            ))}
            {project.assignees.length > 3 && (
              <div className="h-6 w-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs">
                +{project.assignees.length - 3}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              {project.comments}
            </span>
            <span className="flex items-center gap-1">
              <Paperclip className="h-3 w-3" />
              {project.attachments}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [draggedProject, setDraggedProject] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDragStart = (projectId: number) => {
    setDraggedProject(projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: ProjectStatus) => {
    if (draggedProject === null) return;

    setProjects((prev) =>
      prev.map((project) =>
        project.id === draggedProject ? { ...project, status } : project
      )
    );
    setDraggedProject(null);
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getProjectsByStatus = (status: ProjectStatus) =>
    filteredProjects.filter((project) => project.status === status);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground">
              Manage and track your content projects
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <div className="flex items-center border border-border rounded-lg">
              <Button
                variant={viewMode === "board" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-r-none"
                onClick={() => setViewMode("board")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="sm"
                className="rounded-l-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {viewMode === "board" && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {columns.map((column) => (
              <div
                key={column.id}
                className="space-y-3"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
              >
                <div className={`rounded-lg p-3 ${column.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm">{column.title}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {getProjectsByStatus(column.id).length}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 min-h-[200px]">
                  {getProjectsByStatus(column.id).map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onDragStart={handleDragStart}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {project.assignees.slice(0, 2).map((assignee, i) => (
                          <Avatar key={i} className="h-8 w-8 border-2 border-background">
                            <AvatarFallback className="text-xs">
                              {assignee.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      <div>
                        <h4 className="font-medium">{project.title}</h4>
                        <p className="text-sm text-muted-foreground">{project.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={priorityColors[project.priority]} variant="secondary">
                        {project.priority}
                      </Badge>
                      <div className="w-24">
                        <Progress value={project.progress} className="h-2" />
                      </div>
                      <span className="text-sm text-muted-foreground w-24">{project.dueDate}</span>
                      <Badge variant="outline">{project.status.replace("-", " ")}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
