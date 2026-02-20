"use client";

import {useEffect, useState} from "react";
import {EllipsisVertical} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {FolderDot, PlusIcon} from "lucide-react";
import Link from "next/link";
import CreateProjectDialogContent from "./_components/CreateProjectDialogContent";
import EditProjectDialogContent from "./_components/EditProjectDialogContent";

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
  const [activeProject, setActiveProject] = useState<{
    id: number;
    name: string;
    description: string;
    url: string;
  } | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [isEditSubmitting, setIsEditSubmitting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false);

  const fetchProjects = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await fetch("/api/projects");

      if (!response.ok) {
        let errorMessage = "Failed to load projects";
        try {
          const data = (await response.json()) as {error?: string};
          errorMessage = data.error ?? errorMessage;
        } catch {
          // Response is not valid JSON, use default message
        }
        throw new Error(errorMessage);
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
        let errorMessage = "Failed to create project";
        try {
          const data = (await response.json()) as {error?: string};
          errorMessage = data.error ?? errorMessage;
        } catch {
          // Response is not valid JSON, use default message
        }
        throw new Error(errorMessage);
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

  const openEditDialog = (project: {
    id: number;
    name: string;
    description: string;
    url: string;
  }) => {
    setActiveProject(project);
    setEditName(project.name);
    setEditDescription(project.description);
    setEditUrl(project.url);
    setEditError(null);
    setEditOpen(true);
  };

  // open delete dialog and set active project
  const openDeleteDialog = (project: {
    id: number;
    name: string;
    description: string;
    url: string;
  }) => {
    setActiveProject(project);
    setDeleteError(null);
    setDeleteOpen(true);
  };

  // handler for edit project
  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeProject) {
      return;
    }
    setEditError(null);
    setIsEditSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          url: editUrl,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to update project";
        try {
          const data = (await response.json()) as {error?: string};
          errorMessage = data.error ?? errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setEditOpen(false);
      await fetchProjects();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong";
      setEditError(message);
    } finally {
      setIsEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!activeProject) {
      return;
    }

    setDeleteError(null);
    setIsDeleteSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${activeProject.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = "Failed to delete project";
        try {
          const data = (await response.json()) as {error?: string};
          errorMessage = data.error ?? errorMessage;
        } catch {}
        throw new Error(errorMessage);
      }

      setDeleteOpen(false);
      await fetchProjects();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong";
      setDeleteError(message);
    } finally {
      setIsDeleteSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div className="mx-auto max-w-[95%]">
        {/* project header section */}
        <div className="flex lg:justify-between lg:flex-row flex-col border lg:items-center gap-3 lg:gap-10 mt-5 bg-card p-3 lg:p-8 rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold ">Projects</h1>
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
        {/* all project section */}
        {isLoading ? (
          <div className="mx-auto flex flex-col justify-center border rounded-2xl h-[60vh] items-center mt-5 bg-card gap-3">
            <p className="text-sm text-muted-foreground">Loading projects...</p>
          </div>
        ) : loadError ? (
          <div className="mx-auto flex flex-col justify-center border rounded-2xl h-[60vh] items-center mt-5 bg-card gap-3">
            <p className="text-sm text-red-500">{loadError}</p>
            <Button variant="default" onClick={() => void fetchProjects()}>
              Retry
            </Button>
          </div>
        ) : projects.length === 0 ? (
          <div className="mx-auto flex flex-col justify-center border rounded-2xl h-[60vh] items-center mt-5 bg-card gap-3">
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
                className="rounded-2xl border bg-card p-6 shadow-sm"
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
                  {/* // action button delete and edit */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="icon">
                        <EllipsisVertical />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Project actions</DialogTitle>
                        <DialogDescription> </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-2">
                        <DialogClose asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => openEditDialog(project)}
                          >
                            Edit project
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start"
                            onClick={() => openDeleteDialog(project)}
                          >
                            Delete project
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {project.description}
                </p>
                <p className="mt-2 text-sm font-medium text-blue-600">
                  {project.url}
                </p>
                <div className="mt-4 w-full">
                  <Button asChild className="w-full" variant="default">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      View Feedback
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* create project dailog */}
      <CreateProjectDialogContent
        name={name}
        description={description}
        url={url}
        error={error}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={() => setOpen(false)}
        onNameChange={setName}
        onDescriptionChange={setDescription}
        onUrlChange={setUrl}
      />
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <EditProjectDialogContent
          name={editName}
          description={editDescription}
          url={editUrl}
          error={editError}
          isSubmitting={isEditSubmitting}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditOpen(false)}
          onNameChange={setEditName}
          onDescriptionChange={setEditDescription}
          onUrlChange={setEditUrl}
        />
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. It will permanently delete
              {activeProject ? ` ${activeProject.name}` : " this project"}.
            </DialogDescription>
          </DialogHeader>
          {deleteError ? (
            <p className="text-sm text-red-500">{deleteError}</p>
          ) : null}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleteSubmitting}
            >
              {isDeleteSubmitting ? "Deleting..." : "Delete project"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}
