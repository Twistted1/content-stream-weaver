import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  platforms: string[];
  uses: number;
  isFavorite: boolean;
  createdAt: string;
  content?: string;
  /** If this template was imported as a project blueprint, store the raw JSON */
  projectBlueprint?: Record<string, any>;
}

const seedTemplates: Template[] = [
  {
    id: 1,
    name: "Product Launch Announcement",
    description: "Announce new products with impact across all platforms",
    category: "Marketing",
    platforms: ["instagram", "twitter", "linkedin"],
    uses: 234,
    isFavorite: true,
    createdAt: "2024-01-15",
    content: "🚀 Exciting news! We're thrilled to announce [Product Name]...",
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
    content: "Hello [Name],\n\nHere's what's new this week...",
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
    content: "🎉 GIVEAWAY TIME! 🎉\n\nTo enter:\n1. Follow us\n2. Like this post\n3. Tag 2 friends",
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
    content: "# Case Study: [Client Name]\n\n## Challenge\n\n## Solution\n\n## Results",
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
    content: "📅 Mark your calendars!\n\nJoin us for [Event Name]...",
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
    content: '"[Quote from customer]"\n\n— [Customer Name], [Title]',
  },
];

interface TemplatesState {
  templates: Template[];
  addTemplate: (template: Omit<Template, "id">) => void;
  addTemplates: (templates: Omit<Template, "id">[]) => void;
  updateTemplate: (id: number, updates: Partial<Template>) => void;
  deleteTemplate: (id: number) => void;
  toggleFavorite: (id: number) => void;
  incrementUses: (id: number) => void;
}

export const useTemplatesStore = create<TemplatesState>()(
  persist(
    (set) => ({
      templates: seedTemplates,

      addTemplate: (template) =>
        set((state) => ({
          templates: [{ ...template, id: Date.now() + Math.floor(Math.random() * 1000) }, ...state.templates],
        })),

      addTemplates: (newTemplates) =>
        set((state) => ({
          templates: [
            ...newTemplates.map((t, i) => ({ ...t, id: Date.now() + i })),
            ...state.templates,
          ],
        })),

      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),

      deleteTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),

      toggleFavorite: (id) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
          ),
        })),

      incrementUses: (id) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, uses: t.uses + 1 } : t
          ),
        })),
    }),
    { name: "novee-templates" }
  )
);
