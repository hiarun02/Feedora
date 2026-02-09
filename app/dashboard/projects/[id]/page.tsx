import Link from "next/link";
import {notFound, redirect} from "next/navigation";
import {ArrowLeft, MessageSquare, Star, ThumbsUp, Users} from "lucide-react";
import prisma from "@/lib/db";
import {auth} from "@/lib/auth";
import ProjectSnippetDialog from "../_components/ProjectSnippetDialog";

export const runtime = "nodejs";

const formatDate = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(value);

export default async function ProjectDetailsPage({
  params,
}: {
  params: {id: string};
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId)) {
    redirect("/signin");
  }

  const projectId = Number(params.id);

  if (!Number.isInteger(projectId)) {
    notFound();
  }

  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      userId,
    },
  });

  if (!project) {
    notFound();
  }

  const [feedbackStats, positiveStats, uniqueUsers, feedbacks] =
    await Promise.all([
      prisma.feedback.aggregate({
        where: {projectid: projectId},
        _count: {_all: true},
        _avg: {rating: true},
      }),
      prisma.feedback.aggregate({
        where: {projectid: projectId, rating: {gte: 3}},
        _count: {_all: true},
      }),
      prisma.feedback.findMany({
        where: {projectid: projectId},
        distinct: ["email"],
        select: {email: true},
      }),
      prisma.feedback.findMany({
        where: {projectid: projectId},
        orderBy: {createdAt: "desc"},
        take: 8,
      }),
    ]);

  const typedFeedbacks = feedbacks as Array<{
    id: number;
    name: string;
    email: string;
    rating: number;
    feedback: string;
    createdAt: Date;
  }>;

  const totalFeedbacks = feedbackStats._count._all ?? 0;
  const positiveFeedbacks = positiveStats._count._all ?? 0;
  const avgRatingValue = feedbackStats._avg.rating ?? 0;
  const avgRating = avgRatingValue ? avgRatingValue.toFixed(1) : "0.0";
  const uniqueUserCount = uniqueUsers.length;

  return (
    <div className="mx-auto max-w-[95%] pb-10">
      <Link
        href="/dashboard/projects"
        className="mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500 text-2xl font-semibold text-white">
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.url}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <ProjectSnippetDialog projectId={projectId} />
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{totalFeedbacks}</p>
              <p className="text-sm text-muted-foreground">Total Feedbacks</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <ThumbsUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{positiveFeedbacks}</p>
              <p className="text-sm text-muted-foreground">
                Positive (3+ Stars)
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{avgRating}</p>
              <p className="text-sm text-muted-foreground">Avg. Rating</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{uniqueUserCount}</p>
              <p className="text-sm text-muted-foreground">Unique Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-dashed bg-card p-10">
        {totalFeedbacks === 0 ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">No Feedback Yet</p>
            <p className="text-sm text-muted-foreground">
              This project has not received any feedback. Share your widget to
              get started.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">Recent Feedback</p>
                <p className="text-sm text-muted-foreground">
                  Latest responses collected for this project.
                </p>
              </div>
            </div>
            <div className="grid gap-4">
              {typedFeedbacks.map((feedback) => (
                <div
                  key={feedback.id}
                  className="rounded-xl border bg-background p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{feedback.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {feedback.email}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDate(feedback.createdAt)}
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <Star className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">{feedback.rating}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feedback.feedback}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
