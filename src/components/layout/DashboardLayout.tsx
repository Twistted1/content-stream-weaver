import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NoveeMascot } from "../mascot/NoveeMascot";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">{children}</main>
      </div>
      <NoveeMascot />
    </div>
  );
}
