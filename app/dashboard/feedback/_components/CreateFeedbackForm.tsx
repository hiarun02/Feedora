"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fieldStyles =
  "border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

const textareaStyles =
  "min-h-[120px] w-full rounded-md border " + fieldStyles + " dark:bg-input/30";

type ProjectOption = {
  id: number;
  name: string;
};

export default function CreateFeedbackForm({
  projects,
}: {
  projects: ProjectOption[];
}) {
  const router = useRouter();
  const [projectId, setProjectId] = useState(
    projects.length > 0 ? String(projects[0].id) : "",
  );
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("general");
  const [rating, setRating] = useState("none");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!projectId) {
      setError("Select a project to continue.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        projectId: Number(projectId),
        name: name.trim(),
        email: email.trim() || undefined,
        category,
        rating: rating && rating !== "none" ? Number(rating) : undefined,
        feedback: feedback.trim(),
      };

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Unable to create feedback.");
        return;
      }

      setName("");
      setEmail("");
      setCategory("general");
      setRating("none");
      setFeedback("");
      router.refresh();
    } catch {
      setError("Unable to create feedback.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Create a project first to start collecting feedback.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-2">
        <Label htmlFor="feedback-project">Project</Label>
        <Select value={projectId} onValueChange={setProjectId}>
          <SelectTrigger id="feedback-project" className="w-full">
            <SelectValue placeholder="Select a project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project) => (
              <SelectItem key={project.id} value={String(project.id)}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="feedback-name">Name</Label>
        <Input
          id="feedback-name"
          placeholder="Jane Doe"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="feedback-email">Email (optional) </Label>
        <Input
          id="feedback-email"
          placeholder="jane@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="feedback-category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="feedback-category" className="w-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General</SelectItem>
            <SelectItem value="bug">Bug</SelectItem>
            <SelectItem value="feature">Feature request</SelectItem>
            <SelectItem value="ui">UI/UX</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="feedback-rating">Rating</Label>
        <Select value={rating} onValueChange={setRating}>
          <SelectTrigger id="feedback-rating" className="w-full">
            <SelectValue placeholder="Select a rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No rating</SelectItem>
            <SelectItem value="1">1 star</SelectItem>
            <SelectItem value="2">2 stars</SelectItem>
            <SelectItem value="3">3 stars</SelectItem>
            <SelectItem value="4">4 stars</SelectItem>
            <SelectItem value="5">5 stars</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="feedback-message">Feedback</Label>
        <textarea
          id="feedback-message"
          className={textareaStyles}
          placeholder="Share what you think..."
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          required
        />
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create feedback"}
        </Button>
      </div>
    </form>
  );
}
