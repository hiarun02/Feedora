import {auth} from "@/lib/auth";
import prisma from "@/lib/db";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {BarChart3, MessageSquare, Star} from "lucide-react";
import Link from "next/link";
import {redirect} from "next/navigation";

const DashboardPage = async () => {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/signin");
  }

  const user = await prisma.user.findUnique({
    where: {email: session.user.email},
    include: {
      Projects: {
        include: {
          Feedbacks: true,
        },
      },
    },
  });

  if (!user) {
    redirect("/signin");
  }

  // Calculate statistics
  const totalProjects = user.Projects.length;
  const allFeedbacks = user.Projects.flatMap((p) => p.Feedbacks);
  const totalFeedbacks = allFeedbacks.length;

  // Calculate average rating
  const averageRating =
    totalFeedbacks > 0
      ? (
          allFeedbacks.reduce((sum, f) => sum + f.rating, 0) / totalFeedbacks
        ).toFixed(1)
      : "N/A";

  // Calculate weekly stats (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const weeklyProjects = user.Projects.filter(
    (p) => new Date(p.createdAt) > oneWeekAgo,
  ).length;

  const weeklyFeedbacks = allFeedbacks.filter(
    (f) => new Date(f.createdAt) > oneWeekAgo,
  ).length;

  const weeklyRatings = allFeedbacks.filter(
    (f) => new Date(f.createdAt) > oneWeekAgo,
  );
  const weeklyAverageRating =
    weeklyRatings.length > 0
      ? (
          weeklyRatings.reduce((sum, f) => sum + f.rating, 0) /
          weeklyRatings.length
        ).toFixed(1)
      : "0";

  const ratingChange = (
    parseFloat(weeklyAverageRating) -
    (averageRating === "N/A" ? 0 : parseFloat(averageRating as string))
  ).toFixed(1);

  // Get recent feedbacks (last 5)
  const recentFeedbacks = allFeedbacks
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  const hasProjects = totalProjects > 0;

  return (
    <div className="p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {session.user.name || "User"} 👋
        </h1>
        <p className="text-muted-foreground">
          Here a quick look at your projects & feedback.
        </p>
      </div>

      {hasProjects ? (
        <>
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Projects */}
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    Total Projects
                  </p>
                  <p className="text-4xl font-bold">{totalProjects}</p>
                  <p className="text-green-500 text-sm mt-3">
                    ↗ +{weeklyProjects} this week
                  </p>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </Card>

            {/* Total Feedbacks */}
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    Total Feedbacks
                  </p>
                  <p className="text-4xl font-bold">{totalFeedbacks}</p>
                  <p className="text-green-500 text-sm mt-3">
                    ↗ +{weeklyFeedbacks} this week
                  </p>
                </div>
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </Card>

            {/* Average Rating */}
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-muted-foreground text-sm mb-2">
                    Avg. Rating
                  </p>
                  <p className="text-4xl font-bold">{averageRating}</p>
                  <p className="text-green-500 text-sm mt-3">
                    ↗ +{ratingChange} this week
                  </p>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Feedback & Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Feedback */}
            <Card className="p-5">
              <div className="flex justify-between items-center ">
                <h2 className="text-xl font-bold">Recent Feedback</h2>
                <Link href="/dashboard/feedback">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    View All
                  </button>
                </Link>
              </div>

              {recentFeedbacks.length > 0 ? (
                <div className="space-y-3">
                  {recentFeedbacks.slice(0, 3).map((feedback) => (
                    <div
                      key={feedback.id}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition"
                    >
                      {/* Avatar */}
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                        {feedback.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{feedback.name}</p>
                        <p className="text-sm mt-1 break-words">
                          {feedback.feedback.slice(0, 50) +
                            (feedback.feedback.length > 50 ? "..." : "")}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-0.5">
                            {Array.from({length: 5}).map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < feedback.rating
                                    ? "text-yellow-400 text-xs"
                                    : "text-gray-300 text-xs"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="flex-shrink-0 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(feedback.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No feedback yet</p>
                </div>
              )}
            </Card>

            {/* Your Projects */}
            <Card className="p-5 h-fit">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Your Projects</h2>
                <Link href="/dashboard/projects">
                  <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                    View All
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                {user.Projects.slice(0, 5).map((project) => (
                  <Link
                    key={project.id}
                    href={`/dashboard/projects/${project.id}`}
                    className="block"
                  >
                    <div className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition">
                      <div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold">
                            {project.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{project.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {project.Feedbacks.length} feedback
                              {project.Feedbacks.length !== 1 ? "s" : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                        {project.Feedbacks.length ? "Active" : "unactive"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>
        </>
      ) : (
        // No projects yet
        <div className="mx-auto flex justify-center max-w-[95%] border rounded-2xl h-[60vh] items-center mt-10 bg-card">
          <div className="max-w-sm mt-4 flex flex-col items-center gap-2">
            <BarChart3 size={40} />
            <p className="text-xl font-semibold">Welcome to Feedora</p>

            <p className="text-center">
              Get started by creating your first project to collect user
              feedback.
            </p>
            <Link href="/dashboard/projects">
              <Button variant="default">Create your first project</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
