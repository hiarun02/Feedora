import Sidebar from "./sidebar";
import DashboardHeader from "@/components/DashboardHeader";

export const runtime = "nodejs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex bg-background">
      {/* sidebar - always renders (mobile menu button is inside) */}
      <Sidebar />
      {/* main content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* header */}
        <DashboardHeader />
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
