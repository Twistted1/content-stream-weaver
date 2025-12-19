import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

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
  },
  {
    title: "Behind the Scenes",
    description: "Share your creative process",
    icon: PenTool,
    category: "Engagement",
  },
  {
    title: "Tips & Tricks",
    description: "Educational content for your audience",
    icon: Lightbulb,
    category: "Educational",
  },
  {
    title: "User Testimonial",
    description: "Showcase customer success stories",
    icon: MessageSquare,
    category: "Social Proof",
  },
];

const AIAssistant = () => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm your AI content assistant. I can help you create engaging social media posts, generate hashtags, write captions, and brainstorm content ideas. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Here's a creative approach for your content:\n\n✨ **Hook:** Start with a question or bold statement\n📝 **Body:** Share your main message with value\n🎯 **CTA:** End with a clear call-to-action\n\nWould you like me to elaborate on any of these points?",
        "Great idea! Here are some suggestions:\n\n1. **Use storytelling** - People connect with narratives\n2. **Add visuals** - Images increase engagement by 150%\n3. **Include hashtags** - 3-5 relevant ones work best\n4. **Post at peak times** - Usually 9 AM or 7 PM\n\nShall I help you craft specific content?",
        "I've analyzed your request. Here's my recommendation:\n\n🎨 **Visual Style:** Clean and modern\n📱 **Platform:** Best suited for Instagram/LinkedIn\n⏰ **Timing:** Schedule for Tuesday or Thursday\n💡 **Tip:** Use carousel format for higher engagement\n\nWant me to generate the full content?",
      ];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt + " ");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
          <p className="text-muted-foreground">
            Your intelligent content creation companion
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Generated Today</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+12 from yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates Used</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Most: Social Posts</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Words Generated</CardTitle>
              <PenTool className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3,847</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.2h</div>
              <p className="text-xs text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chat" className="space-y-4">
          <TabsList>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="templates">Content Templates</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-4">
              {/* Chat Interface */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Content Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask me anything about content creation
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
                            {message.role === "assistant" && (
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
                      >
                        <prompt.icon className="h-3 w-3" />
                        {prompt.label}
                      </Button>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask me to create content, generate ideas, or help with your social media strategy..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      className="min-h-[80px]"
                    />
                    <div className="flex flex-col gap-2">
                      <Button onClick={handleSend} disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" onClick={() => setInput("")}>
                        <RefreshCw className="h-4 w-4" />
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
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Wand2 className="h-4 w-4" />
                      Generate Post
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Hash className="h-4 w-4" />
                      Find Hashtags
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <Image className="h-4 w-4" />
                      Caption Image
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2">
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
                    <Button className="w-full">Use Template</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Generations</CardTitle>
                <CardDescription>Your content generation history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: "Social Post", platform: "Instagram", time: "2 hours ago" },
                    { type: "Blog Outline", platform: "Website", time: "5 hours ago" },
                    { type: "Hashtags", platform: "Twitter", time: "Yesterday" },
                    { type: "Caption", platform: "LinkedIn", time: "Yesterday" },
                    { type: "Content Ideas", platform: "All", time: "2 days ago" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.type}</p>
                          <p className="text-sm text-muted-foreground">{item.platform}</p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">{item.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default AIAssistant;
