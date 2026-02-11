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
      {/* sidebar */}
      <Sidebar />
      {/* main content */}
      <main className="flex-1 overflow-auto">
        {/* header */}
        <div>
          <DashboardHeader />
          <div></div>
        </div>
        {children}
      </main>
    </div>
  );
}
