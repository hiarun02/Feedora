import CreateProject from "@/components/CreateProject";

export default function DashboardProjectsPage() {
  return (
    <div>
      <div className="border-b">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p>create and manage you projects</p>
      </div>

      <div>
        <div className="max-w-sm mt-4">
          <CreateProject />
        </div>
      </div>
    </div>
  );
}
