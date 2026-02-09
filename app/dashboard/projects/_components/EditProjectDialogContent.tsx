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

type EditProjectDialogContentProps = {
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

export default function EditProjectDialogContent({
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
}: EditProjectDialogContentProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit project</DialogTitle>
        <DialogDescription>
          Update the project details and save your changes.
        </DialogDescription>
      </DialogHeader>
      <form className="grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <Label htmlFor="edit-project-name">Project name</Label>
          <Input
            id="edit-project-name"
            placeholder="Enter your project name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-project-description">Description</Label>
          <Input
            id="edit-project-description"
            placeholder="A short description about your project"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="edit-project-url">Project URL</Label>
          <Input
            id="edit-project-url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
            required
          />
        </div>
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}
