import { useState, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Clock,
  Send,
  Eye,
  Calendar as CalendarIcon,
  Globe,
  CheckCircle2,
  XCircle,
  Save,
  Upload
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { usePosts, useMedia } from "@/hooks/usePosts";
import { Post, PostStatus } from "@/types";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { format } from "date-fns";
import { toast } from "sonner";
import { DragDropImport } from "@/components/common/DragDropImport";
import { useUJT } from "@/hooks/useUJT";

export default function Articles() {
  const { posts, addPost, updatePost, deletePost, publishPost } = usePosts();
  const { uploadMedia } = useMedia();
  const { processUJT } = useUJT();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Partial<Post>>({
    title: "",
    content: "",
    status: "draft",
    type: "article",
    platforms: [],
  });
  const [isNew, setIsNew] = useState(true);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Filter only articles
  const articles = posts.filter(
    (post) => 
      post.type === "article" &&
      (statusFilter === "all" || post.status === statusFilter) &&
      (post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleCreateArticle = () => {
    setCurrentArticle({
      title: "",
      content: "",
      status: "draft",
      type: "article",
      platforms: [],
    });
    setIsNew(true);
    setIsEditorOpen(true);
  };

  const handleEditArticle = (article: Post) => {
    setCurrentArticle({ ...article });
    setIsNew(false);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (!currentArticle.title) {
      toast.error("Please enter a title");
      return;
    }

    if (isNew) {
      addPost.mutate({
        post: {
          title: currentArticle.title,
          content: currentArticle.content || "",
          type: "article",
          status: "draft",
        },
        platforms: [], // Can be selected later or in a separate step
      }, {
        onSuccess: () => {
          setIsEditorOpen(false);
          toast.success("Article draft saved");
        }
      });
    } else if (currentArticle.id) {
      updatePost.mutate({
        id: currentArticle.id,
        title: currentArticle.title,
        content: currentArticle.content,
        // Preserve other fields
        type: currentArticle.type || "article",
        status: currentArticle.status || "draft",
      }, {
        onSuccess: () => {
          setIsEditorOpen(false);
          toast.success("Article updated");
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deletePost.mutate(id);
    }
  };

  const handlePublish = (id: string) => {
    publishPost.mutate(id);
  };
  
  const handleImageUpload = async (file: File): Promise<string> => {
      try {
          const result = await uploadMedia.mutateAsync({ file });
          return result.url;
      } catch (error) {
          console.error("Upload failed", error);
          throw error;
      }
  };
  
  const handleImportClick = () => {
      importInputRef.current?.click();
  };

  const handleImport = (data: any) => {
    if (data.version === "1.0" && Array.isArray(data.items)) {
      processUJT(data);
      return;
    }
    
    // Fallback for simple content import
    if (data.content) {
      setCurrentArticle(prev => ({ ...prev, content: data.content }));
      toast.success("Content imported successfully");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "draft": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "scheduled": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <DragDropImport onImport={handleImport} entityName="Article">
      <DashboardLayout>
        <div className="space-y-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Articles</h1>
              <p className="text-muted-foreground">
                Write, edit, and publish long-form content for your website
              </p>
            </div>
            <Button onClick={handleCreateArticle} className="gap-2">
              <Plus className="h-4 w-4" />
              New Article
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(v: any) => setStatusFilter(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Articles List */}
          {articles.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-12 bg-muted/20">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No articles found</h3>
              <p className="text-muted-foreground mb-6 text-center max-w-sm">
                Start writing your first article to publish on Novus Exchange.
              </p>
              <Button onClick={handleCreateArticle}>Create Article</Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <Card key={article.id} className="group hover:shadow-md transition-all cursor-pointer border-border" onClick={() => handleEditArticle(article)}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-2">
                      <Badge variant="outline" className={cn("capitalize", getStatusColor(article.status))}>
                        {article.status}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditArticle(article); }}>
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          {article.status !== "published" && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handlePublish(article.id); }}>
                              <Send className="h-4 w-4 mr-2" /> Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(article.id); }}>
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="line-clamp-2 leading-tight text-lg">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground line-clamp-3 mb-4 h-[60px]">
                      <div dangerouslySetInnerHTML={{ __html: article.content || "No content" }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(article.updatedAt), "MMM d, yyyy")}
                      </div>
                      {article.status === "published" && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Globe className="h-3 w-3" />
                          Live
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Editor Dialog (Full Screen) */}
          <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <DialogContent className="max-w-[95vw] w-full h-[95vh] flex flex-col p-0 gap-0">
              <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between space-y-0">
                <DialogTitle>{isNew ? "New Article" : "Edit Article"}</DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleImportClick} className="gap-2">
                        <Upload className="h-4 w-4" />
                        Import
                    </Button>
                    <Badge variant="outline" className="mr-4">
                        {isNew ? "Draft" : currentArticle.status}
                    </Badge>
                  </div>
              </DialogHeader>
              
              <input 
                  type="file" 
                  ref={importInputRef} 
                  title="Import article file"
                  aria-label="Import article file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const content = event.target?.result as string;
                      try {
                        // Attempt to parse as JSON first (for UJT payloads)
                        const jsonData = JSON.parse(content);
                        handleImport(jsonData);
                      } catch (err) {
                        // Fallback to plain text import
                        handleImport({ content });
                      }
                    };
                    reader.readAsText(file);
                    if (importInputRef.current) importInputRef.current.value = '';
                  }} 
                  className="hidden" 
                  accept=".md,.txt,.html"
              />

              <div className="flex-1 overflow-y-auto bg-background relative">
                {/* 
                  The Title is contained within the scrollable area so the sticky toolbar
                  in the RichTextEditor locks to the TOP of the viewport as the user scrolls down.
                  The content layout is centered and distraction-free.
                */}
                <div className="w-full h-full flex flex-col">
                  
                  {/* Title Area */}
                  <div className="w-full max-w-4xl mx-auto px-6 sm:px-12 pt-12 pb-6">
                    <Input
                      placeholder="Article Title"
                      className="text-4xl sm:text-5xl font-extrabold border-none shadow-none px-0 focus-visible:ring-0 h-auto placeholder:text-muted-foreground/30 bg-transparent tracking-tight text-foreground"
                      value={currentArticle.title}
                      onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                    />
                  </div>
                  
                  {/* Editor Area */}
                  <div className="flex-1 w-full bg-background border-t shadow-sm">
                    <RichTextEditor
                      content={currentArticle.content || ""}
                      onChange={(content) => setCurrentArticle({ ...currentArticle, content })}
                      className="w-full border-none shadow-none"
                      placeholder="Start writing your story..."
                      onImageUpload={handleImageUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Premium Footer Layout */}
              <DialogFooter className="px-6 py-4 border-t bg-background shadow-[0_-4px_15px_-5px_rgba(0,0,0,0.1)] z-20 sticky bottom-0">
                <div className="flex justify-between w-full items-center">
                  <Button variant="ghost" onClick={() => setIsEditorOpen(false)} className="text-muted-foreground hover:text-foreground h-11 px-6">
                    Cancel
                  </Button>
                  <div className="flex items-center gap-3">
                    {!isNew && currentArticle.status !== "published" && (
                        <Button 
                          variant="outline" 
                          className="bg-background border-primary/20 hover:border-primary/50 text-foreground shadow-sm transition-all"
                          onClick={() => handlePublish(currentArticle.id!)}
                        >
                          <Send className="h-4 w-4 mr-2 text-primary" />
                          Publish Now
                        </Button>
                    )}
                    <Button 
                      onClick={handleSave}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all px-8 rounded-full"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Article
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </DashboardLayout>
    </DragDropImport>
  );
}
