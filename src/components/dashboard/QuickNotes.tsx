import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const notes = [
  {
    title: "Q3 Strategy Keywords",
    content: "digital marketing, B2B content, lead generation, social media ROI",
    color: "border-l-[hsl(var(--chart-2))]",
  },
  {
    title: "Content Ideas",
    content: "Behind the scenes, user testimonials, product tutorials",
    color: "border-l-primary",
  },
  {
    title: "Platform Goals",
    content: "YouTube: 10K subs, TikTok: 50K followers, LinkedIn: engagement +20%",
    color: "border-l-[hsl(var(--warning))]",
  },
];

export function QuickNotes() {
  return (
    <div className="bg-card rounded-xl p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Quick Notes</h3>
        <Button variant="link" className="text-primary p-0 h-auto">
          View All
        </Button>
      </div>

      <div className="space-y-3">
        {notes.map((note, index) => (
          <div
            key={index}
            className={`p-3 bg-secondary/50 rounded-lg border-l-4 ${note.color}`}
          >
            <p className="font-medium text-foreground text-sm mb-1">{note.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-2">{note.content}</p>
          </div>
        ))}
      </div>

      <Button variant="outline" className="w-full mt-4 border-dashed">
        <Plus className="h-4 w-4 mr-2" />
        Add Note
      </Button>
    </div>
  );
}
