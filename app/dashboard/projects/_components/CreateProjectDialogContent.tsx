"use client";

import {Button} from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

type CreateProjectDialogContentProps = {
  name: string;
  description: string;
  url: string;
  error: string | null;
  isSubmitting: boolean;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onUrlChange: (value: string) => void;
};

export default function CreateProjectDialogContent({
  name,
  description,
  url,
  error,
  isSubmitting,
  onSubmit,
  onCancel,
  onNameChange,
  onDescriptionChange,
  onUrlChange,
}: CreateProjectDialogContentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create a new project</DialogTitle>
        <DialogDescription>
          Give your project a name and a short description to get started.
        </DialogDescription>
      </DialogHeader>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            placeholder="Enter your project name"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="project-description">Description</Label>
          <Input
            id="project-description"
            placeholder="A short description about your project"
            value={description}
            onChange={(event) => onDescriptionChange(event.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="project-url">Project URL</Label>
          <Input
            id="project-url"
            placeholder="https://example.com"
            value={url}
            onChange={(event) => onUrlChange(event.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create project"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
