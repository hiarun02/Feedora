"use client";

import {useEffect, useState} from "react";

import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {FolderDot, PlusIcon} from "lucide-react";

export default function DashboardProjectsPage() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<
    Array<{
      id: number;
      name: string;
      description: string;
      url: string;
      createdAt: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch("/api/projects");

      if (!response.ok) {
        const data = (await response.json()) as {error?: string};
        throw new Error(data.error ?? "Failed to load projects");
      }

      const data = (await response.json()) as {
        projects: Array<{
          id: number;
          name: string;
          description: string;
          url: string;
          createdAt: string;
        }>;
      };
      setProjects(data.projects ?? []);
    } catch (fetchError) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Something went wrong";
      setLoadError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchProjects();
  }, []);

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          url,
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as {error?: string};
        throw new Error(data.error ?? "Failed to create project");
      }

      setName("");
      setDescription("");
      setUrl("");
      setOpen(false);
      await fetchProjects();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mx-auto max-w-[95%]">
        <div className="flex justify-between items-center gap-10 mt-5 bg-white dark:bg-gray-800 p-8 rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-sm">
              Manage and monitor all your feedback collection projects.
            </p>
          </div>
          <div>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusIcon /> Create Project
              </Button>
            </DialogTrigger>
          </div>
        </div>

        {isLoading ? (
          <div className="mx-auto flex flex-col justify-center border rounded-2xl h-[60vh] items-center mt-5 bg-white dark:bg-gray-800 gap-3">
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        ) : loadError ? (
          <div className="mx-auto flex flex-col justify-center border rounded-2xl h-[60vh] items-center mt-5 bg-white dark:bg-gray-800 gap-3">
            <p className="text-sm text-red-500">{loadError}</p>
            <Button type="button" variant="secondary" onClick={fetchProjects}>
              Retry
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="mx-auto flex flex-col justify-center border rounded-2xl h-[60vh] items-center mt-5 bg-white dark:bg-gray-800 gap-3">
            <FolderDot size={40} />
            <p className="text-xl font-semibold">Ready to collect feedback?</p>

            <p className="text-center">
              Create your first project to start gathering valuable insights
              from your users.
            </p>
            <DialogTrigger asChild>
              <Button variant="default">
                <PlusIcon /> Create your first project
              </Button>
            </DialogTrigger>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-gray-800"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-700">
                      {project.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-base font-semibold">{project.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(project.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button variant="secondary"> : </Button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <p className="mt-2 text-sm font-medium text-blue-600">
                  {project.url}
                </p>
                <div className="mt-4 w-full">
                  <Button className="w-full" variant="default">
                    View Feedback
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* create project dailog */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>
            Give your project a name and a short description to get started.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="project-name">Project name</Label>
            <Input
              id="project-name"
              placeholder="Enter your project name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-description">Description</Label>
            <Input
              id="project-description"
              placeholder="A short description about your project"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="project-url">Project URL</Label>
            <Input
              id="project-url"
              placeholder="https://example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
