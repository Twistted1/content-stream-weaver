import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addDays } from "date-fns";

// Types
export type ProjectStatus = "backlog" | "in-progress" | "review" | "completed";
export type PostStatus = "draft" | "scheduled" | "published";
export type PostType = "text" | "image" | "video" | "carousel" | "reel" | "thread" | "article";

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

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      projects: initialProjects,
      scheduledPosts: initialPosts,

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
    }),
    {
      name: "app-storage",
    }
  )
);
