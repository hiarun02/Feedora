"use client";

import {Eye, MoreHorizontal, Star, Trash2} from "lucide-react";
import {Button} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type FeedbackRow = {
  id: number;
  name: string;
  email: string | null;
  category: string;
  rating: number;
  feedback: string;
  createdAt: string;
  projectId: number;
  projectName: string;
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

const renderStars = (rating: number) =>
  Array.from({length: 5}).map((_, index) => (
    <Star
      key={index}
      className={`h-4 w-4 ${
        index < rating ? "text-amber-500" : "text-muted-foreground/30"
      }`}
      fill={index < rating ? "currentColor" : "none"}
    />
  ));

export default function FeedbackTable({
  feedbacks,
  emptyMessage = "No feedback yet.",
  onDelete,
  deletingId,
}: {
  feedbacks: FeedbackRow[];
  emptyMessage?: string;
  onDelete?: (id: number) => void;
  deletingId?: number | null;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Feedback</th>
            <th className="px-6 py-4">Project</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Rating</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {feedbacks.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-10 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            feedbacks.map((feedback) => {
              return (
                <tr key={feedback.id} className="bg-card">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                        {feedback.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {feedback.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {feedback.projectName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {feedback.feedback.slice(0, 50) +
                      (feedback.feedback.length > 50 ? "..." : "")}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {feedback.projectName}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {feedback.category}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {renderStars(feedback.rating)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {formatDate(feedback.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Dialog>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DialogTrigger asChild>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4" />
                              View
                            </DropdownMenuItem>
                          </DialogTrigger>
                          {onDelete ? (
                            <DropdownMenuItem
                              variant="destructive"
                              disabled={deletingId === feedback.id}
                              onSelect={() => onDelete(feedback.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              {deletingId === feedback.id
                                ? "Deleting..."
                                : "Delete"}
                            </DropdownMenuItem>
                          ) : null}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Feedback details</DialogTitle>
                          <DialogDescription>
                            Full response submitted by the user.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 text-sm">
                          <div className="grid gap-1">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                              User
                            </p>
                            <p className="font-semibold">{feedback.name}</p>
                            <p className="text-muted-foreground">
                              {feedback.email ?? "No email provided"}
                            </p>
                          </div>
                          <div className="grid gap-1">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                              Project
                            </p>
                            <p>{feedback.projectName}</p>
                          </div>
                          <div className="grid gap-1">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                              Rating
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                {renderStars(feedback.rating)}
                              </div>
                              <span className="text-muted-foreground">
                                {feedback.rating}
                              </span>
                            </div>
                          </div>
                          <div className="grid gap-1">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                              Date
                            </p>
                            <p>{formatDate(feedback.createdAt)}</p>
                          </div>
                          <div className="grid gap-2">
                            <p className="text-xs font-semibold uppercase text-muted-foreground">
                              Feedback
                            </p>
                            <p className="rounded-xl border bg-muted/30 p-3 text-sm text-foreground">
                              {feedback.feedback}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
