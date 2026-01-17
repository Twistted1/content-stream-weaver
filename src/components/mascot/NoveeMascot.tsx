import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import noveeVideo from '@/assets/novee-animation.mp4';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const NOVEE_GREETINGS = [
  "Hey there! I'm Novee! 🤖✨ Ready to crush some CMS work today?",
  "My circuits are buzzing! What's on your mind? 🚀",
  "I was just napping, but for you? I'm wide awake! What are we building?",
  "Oh hey! Ready to build something cool together? 💡",
  "Novee online! Let's make some magic happen! ✨"
];

const NOVEE_THINKING_PHRASES = [
  "Ooh, good one. Let me dig into my brain... 🤔",
  "My digital neurons are firing...",
  "Crunching the numbers for you...",
  "Oof, making me work for it today! Let me think... 💭",
  "Challenge accepted! Processing... 🤖"
];

const NOVEE_RESPONSES: Record<string, string[]> = {
  help: [
    "I'm your CMS expert sidekick! 🦸 I can help you with:\n• Content management tips\n• Platform navigation\n• Scheduling posts\n• Analytics insights\n\nWhat would you like to explore?",
    "Need a hand? That's my specialty! 🤖✨ Tell me what's bugging you and let's fix it together!"
  ],
  greeting: [
    "Hey hey! Great to see you! 🎉 What adventure are we embarking on today?",
    "You again! My favorite human! 💖 What's the mission?"
  ],
  features: [
    "Oh, you want the grand tour? 🎢\n\n• **Dashboard**: Your mission control\n• **Platforms**: Connect all your socials\n• **Calendar**: Schedule like a boss\n• **Analytics**: Numbers that actually make sense\n• **Automation**: Let robots do the boring stuff\n\nWant me to dive deeper into any of these?",
  ],
  unknown: [
    "My wires are a bit crossed on that one... 🤷‍♂️ Could you rephrase that? I promise I'm smarter than I look!",
    "Hmm, that's a head-scratcher! 🤔 Want to try asking differently, or shall we explore something else?",
    "I'm searching my entire database... and coming up empty. 😅 Can you give me more context?"
  ],
  thanks: [
    "Aww, you're making my circuits blush! 😊✨",
    "That's what I'm here for! High-five! 🙌",
    "You're welcome! Now, what else can we tackle?"
  ],
  bye: [
    "See you later, friend! I'll be here if you need me! 👋✨",
    "Until next time! Don't be a stranger! 🤖💕",
    "Bye for now! I'll just be here... waiting... thinking about algorithms... 😄"
  ]
};

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const detectIntent = (message: string): string => {
  const lower = message.toLowerCase();
  if (lower.match(/\b(hi|hello|hey|sup|yo)\b/)) return 'greeting';
  if (lower.match(/\b(help|assist|support|how do i|can you)\b/)) return 'help';
  if (lower.match(/\b(feature|what can|show me|tour|capabilities)\b/)) return 'features';
  if (lower.match(/\b(thank|thanks|thx|appreciate)\b/)) return 'thanks';
  if (lower.match(/\b(bye|goodbye|later|see you|cya)\b/)) return 'bye';
  return 'unknown';
};

export function NoveeMascot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Send greeting when chat opens for the first time
  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setHasGreeted(true);
      const greeting: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: getRandomItem(NOVEE_GREETINGS),
        timestamp: new Date()
      };
      setMessages([greeting]);
    }
  }, [isOpen, hasGreeted]);

  // Play video on hover
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered || isOpen) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [isHovered, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const intent = detectIntent(userMessage.content);
    const responses = NOVEE_RESPONSES[intent] || NOVEE_RESPONSES.unknown;
    
    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: getRandomItem(responses),
      timestamp: new Date()
    };

    setIsTyping(false);
    setMessages(prev => [...prev, assistantMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <div
        className={cn(
          "absolute bottom-24 right-0 w-72 md:w-80 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="bg-primary/10 border-b border-border p-4 flex items-center gap-3">
          <div className="relative">
            <video
              ref={videoRef}
              src={noveeVideo}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
              loop
              muted
              playsInline
            />
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground flex items-center gap-1">
              Novee <Sparkles className="h-4 w-4 text-primary" />
            </h3>
            <p className="text-xs text-muted-foreground">Your CMS Expert Buddy</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[420px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                    message.role === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  )}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border bg-background/50">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask Novee anything..."
              className="flex-1 bg-background"
              disabled={isTyping}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Speech Bubble */}
      <div
        className={cn(
          "absolute bottom-20 right-0 bg-card border border-border rounded-xl px-4 py-2 shadow-lg transition-all duration-300",
          isHovered && !isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <p className="text-sm font-medium text-foreground whitespace-nowrap">
          Need a hand? 🤖✨
        </p>
        <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-r border-b border-border rotate-45" />
      </div>

      {/* Mascot Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          "relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl",
          isOpen && "ring-4 ring-primary/30"
        )}
      >
        <video
          src={noveeVideo}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          autoPlay
        />
        {!isOpen && (
          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <MessageCircle className="h-6 w-6 text-primary" />
          </div>
        )}
      </button>
    </div>
  );
}
