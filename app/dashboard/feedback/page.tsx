import {redirect} from "next/navigation";
import {auth} from "@/lib/auth";

import {Button} from "@/components/ui/button";
import {Inbox, PlusIcon} from "lucide-react";

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

  return (
    <div className="mx-auto max-w-[95%] pb-10">
      {/* feedback header */}
      <div className="flex justify-between items-center gap-10 mt-5 bg-card p-8 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold">Feedback Inbox</h1>
          <p className="text-sm">
            Review, manage, and analyze all user feedback.
          </p>
        </div>
        <div>
          <Button variant="default">
            <PlusIcon /> Add feedback
          </Button>
        </div>
      </div>
      {/* create feedback section show when empty */}
      <div className="mx-auto flex flex-col justify-center border rounded-2xl h-[60vh] items-center mt-5 bg-card gap-3">
        <Inbox size={40} />
        <p className="text-xl font-semibold">Your Inbox is Empty</p>

        <p className="text-center">
          feedback you receive from your users will appear here.
        </p>

        <Button variant="default">
          <PlusIcon /> add your first feedback manually
        </Button>
      </div>
    </div>
  );
}
