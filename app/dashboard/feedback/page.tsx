import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";
import prisma from "@/lib/db";

import {Inbox} from "lucide-react";
import FeedbackInbox from "./_components/FeedbackInbox";
import CreateFeedbackForm from "./_components/CreateFeedbackForm";

export const runtime = "nodejs";

export default async function DashboardFeedbackPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId)) {
    redirect("/signin");
  }

  const [projects, feedbacks] = await Promise.all([
    prisma.project.findMany({
      where: {userId},
      orderBy: {createdAt: "desc"},
      select: {id: true, name: true},
    }),
    prisma.feedback.findMany({
      where: {
        Project: {
          userId,
        },
      },
      orderBy: {createdAt: "desc"},
      include: {Project: {select: {name: true}}},
    }),
  ]);

  const tableFeedbacks = feedbacks.map((feedback) => ({
    id: feedback.id,
    name: feedback.name,
    email: feedback.email,
    rating: feedback.rating,
    feedback: feedback.feedback,
    createdAt: feedback.createdAt.toISOString(),
    projectId: feedback.projectid,
    projectName: feedback.Project?.name ?? "",
  }));

  const hasFeedback = tableFeedbacks.length > 0;

  return (
    <div className="mx-auto max-w-[95%] pb-8 relative">
      <div className="flex items-center border justify-between gap-10 mt-5 bg-card p-8 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold">Feedback Inbox</h1>
          <p className="text-sm">
            Review, manage, and analyze all user feedback.
          </p>
        </div>
      </div>

      {hasFeedback ? (
        <FeedbackInbox feedbacks={tableFeedbacks} />
      ) : (
        <div className="mx-auto mt-6 grid gap-4 rounded-2xl border bg-card p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Inbox className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-xl font-semibold">Your Inbox is Empty</p>
            <p className="text-sm text-muted-foreground">
              Create your first feedback manually by selecting a project below.
            </p>
          </div>
          <CreateFeedbackForm projects={projects} />
        </div>
      )}
    </div>
  );
}
