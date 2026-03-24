import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyState } from "@/components/ui/EmptyState";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  FileText, 
  Image, 
  Hash, 
  MessageSquare,
  Wand2,
  Copy,
  RefreshCw,
  Zap,
  PenTool,
  Lightbulb,
  TrendingUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNoveeChat } from "@/hooks/useNoveeChat";
import { usePosts } from "@/hooks/usePosts";

const quickPrompts = [
  { icon: FileText, label: "Blog Post", prompt: "Write a blog post about" },
  { icon: Hash, label: "Hashtags", prompt: "Generate trending hashtags for" },
  { icon: Image, label: "Image Caption", prompt: "Create an engaging caption for" },
  { icon: MessageSquare, label: "Social Post", prompt: "Write a social media post about" },
  { icon: FileText, label: "Strategy JSON", prompt: "Generate a Universal JSON Template payload for a new Project Strategy. Include fields for title, strategy_outline, project_phases, and key_notes." },
  { icon: TrendingUp, label: "Trending Topics", prompt: "What are trending topics in" },
];

const contentTemplates = [
  {
    title: "Product Launch",
    description: "Announce your new product with impact",
    icon: Zap,
    category: "Marketing",
    prompt: "Help me write a product launch announcement for",
  },
  {
    title: "Behind the Scenes",
    description: "Share your creative process",
    icon: PenTool,
    category: "Engagement",
    prompt: "Create a behind-the-scenes post about",
  },
  {
    title: "Tips & Tricks",
    description: "Educational content for your audience",
    icon: Lightbulb,
    category: "Educational",
    prompt: "Write a tips and tricks post about",
  },
  {
    title: "User Testimonial",
    description: "Showcase customer success stories",
    icon: MessageSquare,
    category: "Social Proof",
    prompt: "Help me format a customer testimonial for",
  },
  {
    title: "Weekly Articles JSON",
    description: "Generate 3 articles in JSON format for import",
    icon: FileText,
    category: "Productivity",
    prompt: "Generate a JSON array for 3 weekly articles about [TOPIC]. The JSON should have fields: title, content, type='article', status='draft', platforms=['website'], and scheduled_at (ISO dates for next week).",
  },
  {
    title: "Strategy JSON Payload",
    description: "Generate UJT payload for Projects & Notes",
    icon: FileText,
    category: "Productivity",
    prompt: "Generate a Universal JSON Template (UJT) containing 'Projects, Notes, and Strategies'. The JSON should include an array of objects with fields for title, strategy_outline, project_phases, and key_notes, formatted as a raw code block so I can import it directly into the CMS.",
  },
  {
    title: "Weekly Social Strategy",
    description: "Generate full JSON workflow (21 Tweets, 7 IG posts)",
    icon: Sparkles,
    category: "Workflow Automation",
    prompt: "Please research the internet for this week's economic news. Format all 21 tweets and 7 Instagram posts for the coming week. NOVUS EXCHANGE brand voice maintained throughout - professional, data-driven, analytical, balanced. No WAR topics unless it directly impacts other countries economically/politically. Output strictly as a structured JSON payload that can be directly imported into our Workflow UI. Ensure each IG post is 800-2,600 chars with 8-10 hashtags, and tweets are under 280 chars.",
  },
];

const GREETING = "Hi";

const AIAssistant = () => {
  const { toast } = useToast();
  const { messages, isLoading, sendMessage, resetChat, addGreeting } = useNoveeChat();
  const { addPost } = usePosts();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("chat");

  // Add greeting on mount
  useEffect(() => {
    if (messages.length === 0) {
      addGreeting(GREETING);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const input = inputRef.current?.value?.trim();
    if (!input || isLoading) return;
    
    if (inputRef.current) inputRef.current.value = "";
    await sendMessage(input);
  };

  const handleQuickPrompt = (prompt: string) => {
    if (inputRef.current) {
      inputRef.current.value = prompt + " ";
      inputRef.current.focus();
    }
  };

  const handleTemplateUse = (prompt: string) => {
    setActiveTab("chat");
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.value = prompt + " ";
        inputRef.current.focus();
      }
    }, 100);
    toast({
      title: "Template loaded",
      description: "Complete your prompt and send it!",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  const handleCreatePostFromAI = (content: string) => {
    addPost.mutate({
      post: {
        title: "AI Generated Post",
        content: content,
        type: "text" as any,
        status: "draft" as any,
        scheduled_at: null,
      },
      platforms: []
    });
    toast({
      title: "Saved as Draft",
      description: "AI generation has been pushed to your CMS drafts overview.",
    });
  };

  const handleNewChat = () => {
    resetChat();
    addGreeting(GREETING);
    toast({
      title: "New chat started",
      description: "Ready for a fresh conversation!",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black tracking-tighter">AI Assistant</h1>
            <p className="text-muted-foreground">
              Your intelligent content creation companion
            </p>
          </div>
          <Button variant="outline" onClick={handleNewChat}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Stats & Main Content Wrapper - Moved to the right */}
        <div className="max-w-6xl ml-auto space-y-6">
          {/* Stats */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Messages Today</CardTitle>
                <Sparkles className="h-3.5 w-3.5 text-primary/60" />
              </CardHeader>
              <CardContent className="pb-3 px-4">
                <div className="text-xl font-black tracking-tighter">{messages.filter(m => m.role === 'user').length}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">AI Responses</CardTitle>
                <Bot className="h-3.5 w-3.5 text-primary/60" />
              </CardHeader>
              <CardContent className="pb-3 px-4">
                <div className="text-xl font-black tracking-tighter">{messages.filter(m => m.role === 'assistant').length}</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</CardTitle>
                <Zap className="h-3.5 w-3.5 text-green-500/60" />
              </CardHeader>
              <CardContent className="pb-3 px-4">
                <div className="text-xl font-black tracking-tighter text-green-500">Online</div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 pt-3 px-4">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Model</CardTitle>
                <PenTool className="h-3.5 w-3.5 text-primary/60" />
              </CardHeader>
              <CardContent className="pb-3 px-4">
                <div className="text-xl font-black tracking-tighter">Gemini</div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="templates">Content Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-4">
                {/* Sidebar */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 text-xs h-9 px-3"
                        onClick={() => handleQuickPrompt("Generate a social media post about")}
                        disabled={isLoading}
                      >
                        <Wand2 className="h-3.5 w-3.5" />
                        Generate Post
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 text-xs h-9 px-3"
                        onClick={() => handleQuickPrompt("Find trending hashtags for")}
                        disabled={isLoading}
                      >
                        <Hash className="h-3.5 w-3.5" />
                        Find Hashtags
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 text-xs h-9 px-3"
                        onClick={() => handleQuickPrompt("Write an engaging caption for my image about")}
                        disabled={isLoading}
                      >
                        <Image className="h-3.5 w-3.5" />
                        Caption Image
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start gap-2 text-xs h-9 px-3"
                        onClick={() => handleQuickPrompt("Brainstorm content ideas for")}
                        disabled={isLoading}
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        Brainstorm Ideas
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Tips</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground space-y-2">
                      <p>💡 Be specific about your audience</p>
                      <p>🎯 Mention the platform you're targeting</p>
                      <p>✨ Include your brand voice preference</p>
                      <p>📊 Ask for variations to A/B test</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Chat Interface */}
                <Card className="lg:col-span-3">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Bot className="h-5 w-5 text-primary" />
                      Novee - Assistant
                    </CardTitle>
                    <CardDescription>
                      Powered by AI to help with content creation
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Messages */}
                    <ScrollArea className="h-[450px] rounded-md border p-4 bg-muted/30">
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.role === "user" ? "justify-end" : "justify-start"
                            }`}
                          >
                            {message.role === "assistant" && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Bot className="h-4 w-4" />
                              </div>
                            )}
                            <div
                              className={`group relative max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm ${
                                message.role === "user"
                                  ? "bg-primary text-primary-foreground rounded-tr-none"
                                  : "bg-card text-card-foreground border rounded-tl-none"
                              }`}
                            >
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              <span className="text-[10px] opacity-50 mt-1.5 block font-medium">
                                {message.timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                              {message.role === "assistant" && message.content !== GREETING && (
                                <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1.5">
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full shadow-md"
                                    title="Copy to clipboard"
                                    onClick={() => copyToClipboard(message.content)}
                                  >
                                    <Copy className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8 rounded-full shadow-md"
                                    title="Save to CMS as Draft"
                                    onClick={() => handleCreatePostFromAI(message.content)}
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              )}
                            </div>
                            {message.role === "user" && (
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
                                <User className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                              <Bot className="h-4 w-4" />
                            </div>
                            <div className="bg-card border rounded-2xl rounded-tl-none px-4 py-2.5 shadow-sm">
                              <div className="flex gap-1.5 items-center h-5">
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.2s]"></span>
                                <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:0.4s]"></span>
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* Quick Prompts */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {quickPrompts.map((prompt) => (
                        <Button
                          key={prompt.label}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickPrompt(prompt.prompt)}
                          className="gap-1.5 h-7 text-[11px] bg-muted/50 hover:bg-muted font-medium"
                          disabled={isLoading}
                        >
                          <prompt.icon className="h-3 w-3" />
                          {prompt.label}
                        </Button>
                      ))}
                    </div>

                    {/* Input */}
                    <div className="flex gap-3 items-end pt-2">
                      <div className="flex-1 relative">
                        <Textarea
                          ref={inputRef}
                          placeholder="Ask Novee to create content, generate ideas..."
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                            }
                          }}
                          className="min-h-[80px] max-h-[200px] resize-none rounded-xl pr-12 text-sm"
                          disabled={isLoading}
                        />
                        <div className="absolute right-3 bottom-3">
                          <Button 
                            onClick={handleSend} 
                            disabled={isLoading}
                            size="icon"
                            className="h-8 w-8 rounded-lg"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="templates" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {contentTemplates.map((template) => (
                  <Card key={template.title} className="group cursor-pointer hover:shadow-lg transition-all border-muted-foreground/10">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <template.icon className="h-5 w-5" />
                        </div>
                        <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-wider">{template.category}</Badge>
                      </div>
                      <CardTitle className="text-base font-bold">{template.title}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2">{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full h-9 rounded-lg text-xs font-semibold" 
                        onClick={() => handleTemplateUse(template.prompt)}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {contentTemplates.length === 0 && (
                <EmptyState
                  icon={FileText}
                  title="No templates available"
                  description="Templates will appear here once created"
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
