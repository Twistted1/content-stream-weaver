import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NoveeMascot } from "../mascot/NoveeMascot";

interface DashboardLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

export function DashboardLayout({ children, hideHeader = false }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        {!hideHeader && <Header />}
        <main className={hideHeader ? "h-screen" : "p-6"}>{children}</main>
      </div>
      <NoveeMascot />
    </div>
  );
}
