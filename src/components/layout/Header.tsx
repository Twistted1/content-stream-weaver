import { Bell, Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Workspace Selector */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <span className="text-xs uppercase tracking-wide">Workspace</span>
          <span className="font-medium text-foreground">My Workspace</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
        <span className="text-muted-foreground">|</span>
        <h2 className="text-lg font-semibold text-foreground">Overview</h2>
      </div>

      {/* Search & Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search anything..."
            className="w-80 pl-10 bg-secondary border-border"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded text-muted-foreground">⌘</kbd>
            <kbd className="px-1.5 py-0.5 text-xs bg-muted rounded text-muted-foreground">K</kbd>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="text-xs uppercase">Local</span>
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-primary rounded-full" />
        </Button>

        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <Avatar className="h-9 w-9 border-2 border-primary">
            <AvatarFallback className="bg-primary/20 text-primary text-sm font-medium">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium text-foreground">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
