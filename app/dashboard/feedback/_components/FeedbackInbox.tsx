"use client";

import {useEffect, useMemo, useState} from "react";
import {useRouter} from "next/navigation";
import {Search} from "lucide-react";

import {Input} from "@/components/ui/input";
import FeedbackTable, {type FeedbackRow} from "./FeedbackTable";

export default function FeedbackInbox({feedbacks}: {feedbacks: FeedbackRow[]}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState(feedbacks);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(feedbacks);
  }, [feedbacks]);

  const filteredFeedbacks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (!normalizedQuery) {
      return items;
    }

    return items.filter((feedback) => {
      return [
        feedback.name,
        feedback.feedback,
        feedback.projectName,
        feedback.email ?? "",
      ].some((value) => value.toLowerCase().includes(normalizedQuery));
    });
  }, [items, searchQuery]);

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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search feedback by content, user, or project..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="pl-9"
          aria-label="Search feedback"
        />
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
