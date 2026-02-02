import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Landing from "./pages/Landing";
import Pricing from "./pages/Pricing";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Auth from "./pages/Auth";
import Index from "./pages/Index";
import Automation from "./pages/Automation";
import Platforms from "./pages/Platforms";
import ContentCalendar from "./pages/Calendar";
import Projects from "./pages/Projects";
import Strategies from "./pages/Strategies";
import Notes from "./pages/Notes";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import GanttChart from "./pages/GanttChart";
import Templates from "./pages/Templates";
import AIAssistant from "./pages/AIAssistant";
import UsersPage from "./pages/Users";
import ImportData from "./pages/ImportData";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Landing />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/auth" element={<Auth />} />
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
          <Route path="/automation" element={<ProtectedRoute><Automation /></ProtectedRoute>} />
          <Route path="/platforms" element={<ProtectedRoute><Platforms /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><ContentCalendar /></ProtectedRoute>} />
          <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
          <Route path="/strategies" element={<ProtectedRoute><Strategies /></ProtectedRoute>} />
          <Route path="/notes" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/gantt" element={<ProtectedRoute><GanttChart /></ProtectedRoute>} />
          <Route path="/templates" element={<ProtectedRoute><Templates /></ProtectedRoute>} />
          <Route path="/ai" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
          <Route path="/import" element={<ProtectedRoute><ImportData /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
