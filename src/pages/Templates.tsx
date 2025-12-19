import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Plus,
  Search,
  Star,
  Copy,
  MoreVertical,
  Instagram,
  Twitter,
  Linkedin,
  Facebook,
  Mail,
  Megaphone,
  Calendar,
  Heart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const templates = [
  {
    id: 1,
    name: "Product Launch Announcement",
    description: "Announce new products with impact across all platforms",
    category: "Marketing",
    platforms: ["instagram", "twitter", "linkedin"],
    uses: 234,
    isFavorite: true,
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    name: "Weekly Newsletter",
    description: "Engaging email template for weekly updates",
    category: "Email",
    platforms: ["email"],
    uses: 156,
    isFavorite: true,
    createdAt: "2024-01-10",
  },
  {
    id: 3,
    name: "Social Media Contest",
    description: "Run engaging contests and giveaways",
    category: "Engagement",
    platforms: ["instagram", "facebook", "twitter"],
    uses: 89,
    isFavorite: false,
    createdAt: "2024-01-08",
  },
  {
    id: 4,
    name: "Case Study",
    description: "Professional case study format for success stories",
    category: "Content",
    platforms: ["linkedin", "email"],
    uses: 67,
    isFavorite: false,
    createdAt: "2024-01-05",
  },
  {
    id: 5,
    name: "Event Promotion",
    description: "Promote upcoming events and webinars",
    category: "Marketing",
    platforms: ["instagram", "facebook", "linkedin", "email"],
    uses: 145,
    isFavorite: true,
    createdAt: "2024-01-03",
  },
  {
    id: 6,
    name: "Customer Testimonial",
    description: "Showcase customer reviews and testimonials",
    category: "Social Proof",
    platforms: ["instagram", "twitter", "linkedin"],
    uses: 112,
    isFavorite: false,
    createdAt: "2024-01-01",
  },
];

const categories = [
  { name: "All Templates", count: 24, icon: FileText },
  { name: "Marketing", count: 8, icon: Megaphone },
  { name: "Email", count: 5, icon: Mail },
  { name: "Engagement", count: 6, icon: Heart },
  { name: "Content", count: 3, icon: Calendar },
  { name: "Social Proof", count: 2, icon: TrendingUp },
];

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  facebook: Facebook,
  email: Mail,
};

const stats = [
  { label: "Total Templates", value: "24", icon: FileText, trend: "+3 this month" },
  { label: "Times Used", value: "1,247", icon: Copy, trend: "+18% vs last month" },
  { label: "Favorites", value: "8", icon: Star, trend: "Most used category" },
  { label: "Team Members", value: "12", icon: Users, trend: "Using templates" },
];

function TemplateCard({ template }: { template: typeof templates[0] }) {
  return (
    <Card className="group hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{template.name}</CardTitle>
              {template.isFavorite && (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              )}
            </div>
            <CardDescription className="mt-1">{template.description}</CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Edit Template</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>Add to Favorites</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{template.category}</Badge>
            <div className="flex items-center gap-1">
              {template.platforms.map((platform) => {
                const Icon = platformIcons[platform];
                return Icon ? (
                  <div
                    key={platform}
                    className="h-6 w-6 rounded-full bg-muted flex items-center justify-center"
                  >
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                ) : null;
              })}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {template.uses} uses
            </span>
            <Button size="sm">Use Template</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Templates() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
            <p className="text-muted-foreground">
              Create and manage reusable content templates
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Categories Sidebar */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm"
                >
                  <div className="flex items-center gap-2">
                    <category.icon className="h-4 w-4 text-muted-foreground" />
                    <span>{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Templates List */}
          <div className="lg:col-span-3 space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10"
                />
              </div>
              <Tabs defaultValue="all" className="w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Templates Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
