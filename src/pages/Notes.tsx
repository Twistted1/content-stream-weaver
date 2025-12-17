import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  StickyNote,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit,
  Clock,
  Tag,
  MoreHorizontal,
  Grid,
  List,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  isPinned: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Q1 Campaign Ideas",
    content: "Focus on user-generated content, collaborate with micro-influencers, launch hashtag challenge on TikTok.",
    tags: ["campaign", "social"],
    isPinned: true,
    color: "bg-primary/10",
    createdAt: "Jan 15, 2024",
    updatedAt: "Jan 18, 2024",
  },
  {
    id: "2",
    title: "Content Pillars",
    content: "1. Educational content\n2. Behind-the-scenes\n3. User testimonials\n4. Product showcases\n5. Industry news",
    tags: ["strategy", "content"],
    isPinned: true,
    color: "bg-accent/50",
    createdAt: "Jan 10, 2024",
    updatedAt: "Jan 12, 2024",
  },
  {
    id: "3",
    title: "Competitor Analysis Notes",
    content: "Brand X posting 3x daily on Instagram. Strong engagement on Reels. Weak LinkedIn presence - opportunity for us.",
    tags: ["research", "competitor"],
    isPinned: false,
    color: "bg-secondary",
    createdAt: "Jan 8, 2024",
    updatedAt: "Jan 8, 2024",
  },
  {
    id: "4",
    title: "Meeting Notes - Client Call",
    content: "Client wants more video content. Budget increased for Q2. Focus on LinkedIn for B2B reach.",
    tags: ["meeting", "client"],
    isPinned: false,
    color: "bg-muted",
    createdAt: "Jan 5, 2024",
    updatedAt: "Jan 5, 2024",
  },
  {
    id: "5",
    title: "Hashtag Research",
    content: "#ContentMarketing - 2.5M posts\n#SocialMediaTips - 1.8M posts\n#DigitalMarketing - 5M posts\n#MarketingStrategy - 800K posts",
    tags: ["research", "hashtags"],
    isPinned: false,
    color: "bg-primary/10",
    createdAt: "Jan 3, 2024",
    updatedAt: "Jan 3, 2024",
  },
  {
    id: "6",
    title: "Tool Recommendations",
    content: "Canva for graphics, CapCut for video editing, Later for scheduling, Notion for planning.",
    tags: ["tools", "resources"],
    isPinned: false,
    color: "bg-accent/50",
    createdAt: "Jan 1, 2024",
    updatedAt: "Jan 1, 2024",
  },
];

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "", tags: "" });

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const pinnedNotes = filteredNotes.filter((note) => note.isPinned);
  const otherNotes = filteredNotes.filter((note) => !note.isPinned);

  const togglePin = (id: string) => {
    setNotes(notes.map((note) =>
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleCreateNote = () => {
    if (!newNote.title.trim()) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      tags: newNote.tags.split(",").map((t) => t.trim()).filter(Boolean),
      isPinned: false,
      color: "bg-muted",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    
    setNotes([note, ...notes]);
    setNewNote({ title: "", content: "", tags: "" });
    setIsDialogOpen(false);
  };

  const NoteCard = ({ note }: { note: Note }) => (
    <Card className={cn("group transition-all hover:shadow-md", note.color)}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base font-semibold line-clamp-1">
            {note.title}
          </CardTitle>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => togglePin(note.id)}
            >
              <Pin className={cn("h-4 w-4", note.isPinned && "fill-current")} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => deleteNote(note.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
          {note.content}
        </p>
        <div className="flex flex-wrap gap-1">
          {note.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>Updated {note.updatedAt}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notes</h1>
            <p className="text-muted-foreground">
              Capture ideas, research, and quick thoughts
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Note title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                />
                <Textarea
                  placeholder="Write your note..."
                  rows={5}
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={newNote.tags}
                  onChange={(e) => setNewNote({ ...newNote, tags: e.target.value })}
                />
                <Button onClick={handleCreateNote} className="w-full">
                  Create Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and View Toggle */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4">
          <Card className="flex-1">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <StickyNote className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{notes.length}</p>
                <p className="text-xs text-muted-foreground">Total Notes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                <Pin className="h-5 w-5 text-accent-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pinnedNotes.length}</p>
                <p className="text-xs text-muted-foreground">Pinned</p>
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                <Tag className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {[...new Set(notes.flatMap((n) => n.tags))].length}
                </p>
                <p className="text-xs text-muted-foreground">Tags</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pinned Notes */}
        {pinnedNotes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <Pin className="h-4 w-4" />
              Pinned
            </h2>
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  : "space-y-3"
              )}
            >
              {pinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}

        {/* Other Notes */}
        {otherNotes.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-muted-foreground">
              All Notes
            </h2>
            <div
              className={cn(
                viewMode === "grid"
                  ? "grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                  : "space-y-3"
              )}
            >
              {otherNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        )}

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <StickyNote className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No notes found</h3>
            <p className="text-muted-foreground">
              Try a different search or create a new note
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Notes;
