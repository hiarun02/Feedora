import {auth} from "@/lib/auth";
import {redirect} from "next/navigation";
import Link from "next/link";
import {LayoutDashboard, FolderDot, MessageCircle} from "lucide-react";
import LogoutButton from "@/components/LogoutButton";

export const runtime = "nodejs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/signin");
  }

  const navLinks = [
    {name: "Dashboard", icon: LayoutDashboard, href: "/dashboard"},
    {name: "Projects", icon: FolderDot, href: "/dashboard/projects"},
    {name: "Feedbacks", icon: MessageCircle, href: "/dashboard/feedback"},
  ];

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* sidebar */}
      <aside className="w-60 border-r h-full flex flex-col">
        <div className="mb-3 border-b p-5">
          <h3 className="font-bold">Feedora</h3>
        </div>
        <nav className="flex flex-col gap-8 p-5 h-full justify-between">
          <ul className="flex flex-col gap-4 text-sm">
            {navLinks.map((link) => (
              <li
                key={link.name}
                className="flex items-center font-medium gap-3 hover:bg-gray-200 p-2 rounded-md"
              >
                <link.icon size={18} />
                <Link href={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
          {/* bottom section */}
          <div className="flex flex-col gap-1 text-sm">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-medium">{session.user?.email}</p>
            <LogoutButton className="mt-3" size="sm" variant="outline" />
          </div>
        </nav>
      </aside>

      {/* main */}
      <main className="flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
