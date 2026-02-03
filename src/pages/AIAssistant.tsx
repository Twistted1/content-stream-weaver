import { useEffect, useRef } from "react";
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

const quickPrompts = [
  { icon: FileText, label: "Blog Post", prompt: "Write a blog post about" },
  { icon: Hash, label: "Hashtags", prompt: "Generate trending hashtags for" },
  { icon: Image, label: "Image Caption", prompt: "Create an engaging caption for" },
  { icon: MessageSquare, label: "Social Post", prompt: "Write a social media post about" },
  { icon: Lightbulb, label: "Content Ideas", prompt: "Give me 5 content ideas about" },
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
];

const GREETING = "Hello! I'm Novee, your AI content assistant. 🤖✨ I can help you create engaging social media posts, generate hashtags, write captions, and brainstorm content ideas. How can I help you today?";

const AIAssistant = () => {
  const { toast } = useToast();
  const { messages, isLoading, sendMessage, resetChat, addGreeting } = useNoveeChat();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    if (inputRef.current) {
      inputRef.current.value = prompt + " ";
      inputRef.current.focus();
    }
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
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground">
              Your intelligent content creation companion
            </p>
          </div>
          <Button variant="outline" onClick={handleNewChat}>
            <RefreshCw className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.filter(m => m.role === 'user').length}</div>
              <p className="text-xs text-muted-foreground">In this session</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Responses</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{messages.filter(m => m.role === 'assistant').length}</div>
              <p className="text-xs text-muted-foreground">Helpful answers</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">Online</div>
              <p className="text-xs text-muted-foreground">Novee is ready</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Model</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Gemini</div>
              <p className="text-xs text-muted-foreground">Fast & capable</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="templates">Content Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {/* Chat Interface */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Novee - Content Assistant
                  </CardTitle>
                  <CardDescription>
                    Powered by AI to help with content creation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Messages */}
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${
                            message.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          {message.role === "assistant" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                              <Bot className="h-4 w-4 text-primary-foreground" />
                            </div>
                          )}
                          <div
                            className={`group relative max-w-[80%] rounded-lg px-4 py-2 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <span className="text-xs opacity-50 mt-1 block">
                              {message.timestamp.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {message.role === "assistant" && message.content !== GREETING && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => copyToClipboard(message.content)}
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          {message.role === "user" && (
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary">
                              <User className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                            <Bot className="h-4 w-4 text-primary-foreground" />
                          </div>
                          <div className="bg-muted rounded-lg px-4 py-2">
                            <div className="flex gap-1">
                              <span className="animate-bounce">●</span>
                              <span className="animate-bounce" style={{ animationDelay: "0.1s" }}>●</span>
                              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>●</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Quick Prompts */}
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((prompt) => (
                      <Button
                        key={prompt.label}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickPrompt(prompt.prompt)}
                        className="gap-1"
                        disabled={isLoading}
                      >
                        <prompt.icon className="h-3 w-3" />
                        {prompt.label}
                      </Button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Textarea
                      ref={inputRef}
                      placeholder="Ask Novee to create content, generate ideas, or help with your social media strategy..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="min-h-[80px]"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col gap-2">
                      <Button onClick={handleSend} disabled={isLoading}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sidebar */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => handleQuickPrompt("Generate a social media post about")}
                      disabled={isLoading}
                    >
                      <Wand2 className="h-4 w-4" />
                      Generate Post
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => handleQuickPrompt("Find trending hashtags for")}
                      disabled={isLoading}
                    >
                      <Hash className="h-4 w-4" />
                      Find Hashtags
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => handleQuickPrompt("Write an engaging caption for my image about")}
                      disabled={isLoading}
                    >
                      <Image className="h-4 w-4" />
                      Caption Image
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start gap-2"
                      onClick={() => handleQuickPrompt("Brainstorm content ideas for")}
                      disabled={isLoading}
                    >
                      <Lightbulb className="h-4 w-4" />
                      Brainstorm Ideas
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Tips</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                    <p>💡 Be specific about your audience</p>
                    <p>🎯 Mention the platform you're targeting</p>
                    <p>✨ Include your brand voice preference</p>
                    <p>📊 Ask for variations to A/B test</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {contentTemplates.map((template) => (
                <Card key={template.title} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <template.icon className="h-8 w-8 text-primary" />
                      <Badge variant="secondary">{template.category}</Badge>
                    </div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className="w-full" 
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
    </DashboardLayout>
  );
};

export default AIAssistant;
