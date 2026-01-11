import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays } from "date-fns";
import { User, rolePermissions } from "@/components/users/usersData";
import { Strategy, StrategyStatus } from "@/components/strategies/strategiesData";

// Types
export type ProjectStatus = "backlog" | "in-progress" | "review" | "completed";
export type PostStatus = "draft" | "scheduled" | "published";
export type PostType = "text" | "image" | "video" | "carousel" | "reel" | "thread" | "article";
export type AutomationStatus = "active" | "paused";
export type TriggerType = "scheduled" | "new-content" | "engagement" | "manual";

export interface Project {
  id: string;
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
  createdAt: string;
}

export interface ScheduledPost {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
  status: PostStatus;
  type: PostType;
  createdAt: string;
}

export interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  triggerConfig: {
    schedule?: string;
    threshold?: number;
  };
  platforms: string[];
  status: AutomationStatus;
  lastRun: string | null;
  runs: number;
  createdAt: string;
}

export interface AutomationRun {
  id: string;
  automationId: string;
  status: "success" | "failed" | "running";
  startedAt: string;
  completedAt: string | null;
  message: string;
}

interface AppState {
  // Projects
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "createdAt">) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  moveProject: (id: string, status: ProjectStatus) => void;

  // Scheduled Posts (shared between Platforms and Calendar)
  scheduledPosts: ScheduledPost[];
  addPost: (post: Omit<ScheduledPost, "id" | "createdAt">) => void;
  updatePost: (id: string, updates: Partial<ScheduledPost>) => void;
  deletePost: (id: string) => void;
  reschedulePost: (id: string, date: string, time?: string) => void;
  publishPost: (id: string) => void;

  // Automations
  automations: Automation[];
  automationRuns: AutomationRun[];
  addAutomation: (automation: Omit<Automation, "id" | "createdAt" | "lastRun" | "runs">) => void;
  updateAutomation: (id: string, updates: Partial<Automation>) => void;
  deleteAutomation: (id: string) => void;
  deleteAutomations: (ids: string[]) => void;
  toggleAutomation: (id: string) => void;
  toggleAutomations: (ids: string[], status: AutomationStatus) => void;
  duplicateAutomation: (id: string) => void;
  runAutomation: (id: string) => string;
  completeAutomationRun: (runId: string, success: boolean, message: string, automationId: string) => void;

  // Strategies
  strategies: Strategy[];
  addStrategy: (strategy: Omit<Strategy, "id" | "createdAt">) => void;
  updateStrategy: (id: string, updates: Partial<Strategy>) => void;
  deleteStrategy: (id: string) => void;
  deleteStrategies: (ids: string[]) => void;
  duplicateStrategy: (id: string) => void;
  changeStrategyStatus: (id: string, status: StrategyStatus) => void;
  changeStrategiesStatus: (ids: string[], status: StrategyStatus) => void;

  // Users
  users: User[];
  addUser: (user: Omit<User, "id" | "joinedDate" | "lastActive" | "permissions"> & { permissions?: string[] }) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  deleteUsers: (ids: string[]) => void;
  toggleUserStatus: (id: string) => void;
  changeUserRole: (id: string, role: User["role"]) => void;
  resendInvite: (id: string) => void;
}

const initialProjects: Project[] = [
  {
    id: "1",
    title: "Q4 Marketing Campaign",
    description: "Plan and execute holiday marketing campaign across all platforms",
    status: "in-progress",
    priority: "high",
    dueDate: "Dec 20, 2025",
    progress: 65,
    comments: 12,
    attachments: 5,
    assignees: [{ name: "Alice Johnson" }, { name: "Bob Smith" }],
    tags: ["Marketing", "Social Media"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Website Redesign Content",
    description: "Create all copy and visuals for the new website launch",
    status: "in-progress",
    priority: "high",
    dueDate: "Dec 15, 2025",
    progress: 40,
    comments: 8,
    attachments: 12,
    assignees: [{ name: "Carol Davis" }],
    tags: ["Website", "Design"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Product Launch Video",
    description: "Script and produce launch video for new product line",
    status: "review",
    priority: "medium",
    dueDate: "Dec 18, 2025",
    progress: 90,
    comments: 15,
    attachments: 8,
    assignees: [{ name: "David Lee" }, { name: "Eve Wilson" }],
    tags: ["Video", "Product"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Blog Content Series",
    description: "Write 10-part blog series on industry trends",
    status: "backlog",
    priority: "low",
    dueDate: "Jan 10, 2026",
    progress: 10,
    comments: 3,
    attachments: 2,
    assignees: [{ name: "Frank Miller" }],
    tags: ["Blog", "SEO"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Social Media Templates",
    description: "Design reusable templates for Instagram and TikTok",
    status: "backlog",
    priority: "medium",
    dueDate: "Dec 30, 2025",
    progress: 0,
    comments: 2,
    attachments: 0,
    assignees: [{ name: "Grace Taylor" }],
    tags: ["Design", "Social Media"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Email Newsletter Redesign",
    description: "Refresh email templates and newsletter layout",
    status: "completed",
    priority: "medium",
    dueDate: "Dec 10, 2025",
    progress: 100,
    comments: 20,
    attachments: 6,
    assignees: [{ name: "Henry Brown" }, { name: "Ivy Chen" }],
    tags: ["Email", "Design"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "7",
    title: "Influencer Collaboration",
    description: "Coordinate content with partner influencers",
    status: "review",
    priority: "high",
    dueDate: "Dec 22, 2025",
    progress: 75,
    comments: 25,
    attachments: 10,
    assignees: [{ name: "Jack White" }],
    tags: ["Influencer", "Partnership"],
    createdAt: new Date().toISOString(),
  },
  {
    id: "8",
    title: "Annual Report Graphics",
    description: "Create infographics and charts for annual report",
    status: "completed",
    priority: "low",
    dueDate: "Dec 5, 2025",
    progress: 100,
    comments: 8,
    attachments: 15,
    assignees: [{ name: "Karen Green" }],
    tags: ["Design", "Corporate"],
    createdAt: new Date().toISOString(),
  },
];

const today = new Date();
const initialPosts: ScheduledPost[] = [
  {
    id: "1",
    title: "New product launch announcement",
    content: "Exciting news! We're launching our new product line next week. Stay tuned for exclusive previews and early access offers!",
    platforms: ["youtube", "instagram", "facebook"],
    scheduledDate: today.toISOString().split("T")[0],
    scheduledTime: "10:00",
    status: "scheduled",
    type: "video",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Behind the scenes content",
    content: "Take a peek behind the curtain! Watch how our team brings creative ideas to life.",
    platforms: ["instagram", "tiktok"],
    scheduledDate: today.toISOString().split("T")[0],
    scheduledTime: "14:00",
    status: "scheduled",
    type: "reel",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Weekly tips thread",
    content: "5 tips to boost your productivity this week. Thread incoming! 🧵",
    platforms: ["twitter", "linkedin"],
    scheduledDate: addDays(today, 1).toISOString().split("T")[0],
    scheduledTime: "09:00",
    status: "draft",
    type: "thread",
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Customer testimonial video",
    content: "Hear from our amazing customers about their experience with our products.",
    platforms: ["youtube", "facebook", "linkedin"],
    scheduledDate: addDays(today, 2).toISOString().split("T")[0],
    scheduledTime: "11:00",
    status: "scheduled",
    type: "video",
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "Flash sale announcement",
    content: "24-hour flash sale! Don't miss out on exclusive deals.",
    platforms: ["instagram", "facebook", "twitter"],
    scheduledDate: addDays(today, 3).toISOString().split("T")[0],
    scheduledTime: "08:00",
    status: "scheduled",
    type: "image",
    createdAt: new Date().toISOString(),
  },
  {
    id: "6",
    title: "Industry news commentary",
    content: "Our take on the latest industry developments and what they mean for you.",
    platforms: ["linkedin", "twitter"],
    scheduledDate: addDays(today, 4).toISOString().split("T")[0],
    scheduledTime: "15:00",
    status: "draft",
    type: "article",
    createdAt: new Date().toISOString(),
  },
];

const initialAutomations: Automation[] = [
  {
    id: "1",
    name: "Auto-publish to all platforms",
    description: "Automatically publish scheduled content to YouTube, TikTok, Instagram, Facebook, X, and LinkedIn",
    trigger: "scheduled",
    triggerConfig: { schedule: "daily" },
    platforms: ["YouTube", "TikTok", "Instagram", "Facebook", "X", "LinkedIn"],
    status: "active",
    lastRun: "2 hours ago",
    runs: 156,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Cross-post new blog articles",
    description: "When a new blog post is published, create social media posts for all platforms",
    trigger: "new-content",
    triggerConfig: {},
    platforms: ["X", "LinkedIn", "Facebook"],
    status: "active",
    lastRun: "1 day ago",
    runs: 42,
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Weekly performance digest",
    description: "Send weekly email report with analytics from all connected platforms",
    trigger: "scheduled",
    triggerConfig: { schedule: "weekly" },
    platforms: ["Email"],
    status: "active",
    lastRun: "3 days ago",
    runs: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Engagement notifications",
    description: "Get notified when posts exceed engagement thresholds",
    trigger: "engagement",
    triggerConfig: { threshold: 1000 },
    platforms: ["Slack", "Email"],
    status: "paused",
    lastRun: "1 week ago",
    runs: 89,
    createdAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Content backup",
    description: "Automatically backup all published content to cloud storage",
    trigger: "scheduled",
    triggerConfig: { schedule: "daily" },
    platforms: ["Google Drive"],
    status: "active",
    lastRun: "12 hours ago",
    runs: 365,
    createdAt: new Date().toISOString(),
  },
];

const initialUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@company.com",
    avatar: "",
    role: "admin",
    status: "active",
    lastActive: "2 minutes ago",
    joinedDate: "Jan 15, 2024",
    permissions: ["manage_users", "manage_content", "manage_settings", "view_analytics", "view_content", "publish_content"],
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@company.com",
    avatar: "",
    role: "editor",
    status: "active",
    lastActive: "1 hour ago",
    joinedDate: "Feb 20, 2024",
    permissions: ["manage_content", "view_analytics", "view_content", "publish_content"],
  },
  {
    id: "3",
    name: "Emily Davis",
    email: "emily@company.com",
    avatar: "",
    role: "viewer",
    status: "active",
    lastActive: "3 hours ago",
    joinedDate: "Mar 10, 2024",
    permissions: ["view_analytics", "view_content"],
  },
  {
    id: "4",
    name: "James Wilson",
    email: "james@company.com",
    avatar: "",
    role: "member",
    status: "pending",
    lastActive: "Never",
    joinedDate: "Dec 1, 2024",
    permissions: ["view_content"],
  },
  {
    id: "5",
    name: "Lisa Anderson",
    email: "lisa@company.com",
    avatar: "",
    role: "editor",
    status: "inactive",
    lastActive: "2 weeks ago",
    joinedDate: "Nov 5, 2024",
    permissions: ["manage_content", "view_content"],
  },
];

const initialStrategies: Strategy[] = [
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
  },
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: initialProjects,
      scheduledPosts: initialPosts,
      automations: initialAutomations,
      automationRuns: [],
      users: initialUsers,
      strategies: initialStrategies,

      // Project actions
      addProject: (project) =>
        set((state) => ({
          projects: [
            ...state.projects,
            {
              ...project,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),

      moveProject: (id, status) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, status } : p
          ),
        })),

      // Post actions
      addPost: (post) =>
        set((state) => ({
          scheduledPosts: [
            ...state.scheduledPosts,
            {
              ...post,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updatePost: (id, updates) =>
        set((state) => ({
          scheduledPosts: state.scheduledPosts.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      deletePost: (id) =>
        set((state) => ({
          scheduledPosts: state.scheduledPosts.filter((p) => p.id !== id),
        })),

      reschedulePost: (id, date, time) =>
        set((state) => ({
          scheduledPosts: state.scheduledPosts.map((p) =>
            p.id === id
              ? { ...p, scheduledDate: date, scheduledTime: time || p.scheduledTime }
              : p
          ),
        })),

      publishPost: (id) =>
        set((state) => ({
          scheduledPosts: state.scheduledPosts.map((p) =>
            p.id === id ? { ...p, status: "published" as PostStatus } : p
          ),
        })),

      // Automation actions
      addAutomation: (automation) =>
        set((state) => ({
          automations: [
            ...state.automations,
            {
              ...automation,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              lastRun: null,
              runs: 0,
            },
          ],
        })),

      updateAutomation: (id, updates) =>
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      deleteAutomation: (id) =>
        set((state) => ({
          automations: state.automations.filter((a) => a.id !== id),
        })),

      deleteAutomations: (ids) =>
        set((state) => ({
          automations: state.automations.filter((a) => !ids.includes(a.id)),
        })),

      toggleAutomation: (id) =>
        set((state) => ({
          automations: state.automations.map((a) =>
            a.id === id
              ? { ...a, status: a.status === "active" ? "paused" : "active" }
              : a
          ),
        })),

      toggleAutomations: (ids, status) =>
        set((state) => ({
          automations: state.automations.map((a) =>
            ids.includes(a.id) ? { ...a, status } : a
          ),
        })),

      duplicateAutomation: (id) => {
        const automation = get().automations.find((a) => a.id === id);
        if (automation) {
          set((state) => ({
            automations: [
              ...state.automations,
              {
                ...automation,
                id: Date.now().toString(),
                name: `${automation.name} (Copy)`,
                createdAt: new Date().toISOString(),
                lastRun: null,
                runs: 0,
                status: "paused",
              },
            ],
          }));
        }
      },

      runAutomation: (id) => {
        const runId = Date.now().toString();
        set((state) => ({
          automationRuns: [
            {
              id: runId,
              automationId: id,
              status: "running",
              startedAt: new Date().toISOString(),
              completedAt: null,
              message: "Automation started...",
            },
            ...state.automationRuns,
          ],
        }));
        return runId;
      },

      completeAutomationRun: (runId, success, message, automationId) =>
        set((state) => ({
          automationRuns: state.automationRuns.map((r) =>
            r.id === runId
              ? {
                  ...r,
                  status: success ? "success" : "failed",
                  completedAt: new Date().toISOString(),
                  message,
                }
              : r
          ),
          automations: state.automations.map((a) =>
            a.id === automationId
              ? { ...a, runs: a.runs + 1, lastRun: "Just now" }
              : a
          ),
        })),

      // User actions
      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              ...user,
              id: Date.now().toString(),
              joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              lastActive: user.status === "pending" ? "Never" : "Just now",
              permissions: user.permissions || rolePermissions[user.role] || ["view_content"],
            },
          ],
        })),

      updateUser: (id, updates) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id ? { ...u, ...updates } : u
          ),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      deleteUsers: (ids) =>
        set((state) => ({
          users: state.users.filter((u) => !ids.includes(u.id)),
        })),

      toggleUserStatus: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, status: u.status === "active" ? "inactive" : "active" }
              : u
          ),
        })),

      changeUserRole: (id, role) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, role, permissions: rolePermissions[role] || ["view_content"] }
              : u
          ),
        })),

      resendInvite: (id) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === id
              ? { ...u, joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
              : u
          ),
        })),

      // Strategy actions
      addStrategy: (strategy) =>
        set((state) => ({
          strategies: [
            ...state.strategies,
            {
              ...strategy,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateStrategy: (id, updates) =>
        set((state) => ({
          strategies: state.strategies.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        })),

      deleteStrategy: (id) =>
        set((state) => ({
          strategies: state.strategies.filter((s) => s.id !== id),
        })),

      deleteStrategies: (ids) =>
        set((state) => ({
          strategies: state.strategies.filter((s) => !ids.includes(s.id)),
        })),

      duplicateStrategy: (id) => {
        const strategy = get().strategies.find((s) => s.id === id);
        if (strategy) {
          set((state) => ({
            strategies: [
              ...state.strategies,
              {
                ...strategy,
                id: Date.now().toString(),
                name: `${strategy.name} (Copy)`,
                createdAt: new Date().toISOString(),
              },
            ],
          }));
        }
      },

      changeStrategyStatus: (id, status) =>
        set((state) => ({
          strategies: state.strategies.map((s) =>
            s.id === id ? { ...s, status } : s
          ),
        })),

      changeStrategiesStatus: (ids, status) =>
        set((state) => ({
          strategies: state.strategies.map((s) =>
            ids.includes(s.id) ? { ...s, status } : s
          ),
        })),
    }),
    {
      name: "app-storage",
    }
  )
);
