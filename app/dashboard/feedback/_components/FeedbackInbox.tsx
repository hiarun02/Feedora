"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Search} from "lucide-react";

import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FeedbackTable, {type FeedbackRow} from "./FeedbackTable";

interface Project {
  id: number;
  name: string;
}

export default function FeedbackInbox({
  feedbacks,
  projects = [],
}: {
  feedbacks: FeedbackRow[];
  projects?: Project[];
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [items, setItems] = useState(feedbacks);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    setItems(feedbacks);
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    let filtered = items;

    // Filter by project if selected (not all)
    if (selectedProjectId !== "all") {
      const projectIdNum = Number(selectedProjectId);
      filtered = filtered.filter(
        (feedback) => feedback.projectId === projectIdNum,
      );
    }
    // Filter by category if selected (not all)
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (feedback) => feedback.category === selectedCategory,
      );
    }

    // Filter by search query
    if (!normalizedQuery) {
      return filtered;
    }

    return filtered.filter((feedback) => {
      return [
        feedback.name,
        feedback.feedback,
        feedback.projectName,
        feedback.email ?? "",
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [items, searchQuery, selectedProjectId, selectedCategory]);

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Delete this feedback? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setError(null);

    try {
      const response = await fetch(`/api/feedback/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setError(data?.error ?? "Unable to delete feedback.");
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      router.refresh();
    } catch {
      setError("Unable to delete feedback.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 grid gap-4">
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search feedback by content, user, or project..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="pl-9"
            aria-label="Search feedback"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center min-w-fit w-full md:w-auto">
          <Select
            value={selectedProjectId}
            onValueChange={setSelectedProjectId}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All projects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={String(project.id)}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Category filter dropdown */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {/* Dynamically get unique categories from feedbacks */}
              {Array.from(
                new Set(feedbacks.map((f) => f.category).filter(Boolean)),
              ).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
      <div className="overflow-hidden rounded-2xl border bg-card">
        <FeedbackTable
          feedbacks={filteredFeedbacks}
          emptyMessage="No feedback matches your search."
          onDelete={handleDelete}
          deletingId={deletingId}
        />
      </div>
    </div>
  );
}
