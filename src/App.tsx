import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Automation from "./pages/Automation";
import Platforms from "./pages/Platforms";
import ContentCalendar from "./pages/Calendar";
import Projects from "./pages/Projects";
import Strategies from "./pages/Strategies";
import Notes from "./pages/Notes";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/automation" element={<Automation />} />
          <Route path="/platforms" element={<Platforms />} />
          <Route path="/calendar" element={<ContentCalendar />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
