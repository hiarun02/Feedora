import {Button} from "@/components/ui/button";
import {FolderDot} from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="mx-auto flex justify-center max-w-[95%] border rounded-2xl h-[60vh] items-center mt-10 bg-card">
      <div className="max-w-sm mt-4 flex flex-col items-center gap-2">
        <FolderDot size={40} />
        <p className="text-xl font-semibold">Welcome to Feedora</p>

        <p className="text-center">
          Get started by creating your first project to collect user feedback.
        </p>
        <Link href="/dashboard/projects">
          <Button variant="default">Create your first project</Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
