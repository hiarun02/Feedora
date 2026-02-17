import {NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = "nodejs";

export async function DELETE(
  _request: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId)) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const {id} = await params;
  const feedbackId = Number(id);

  if (!Number.isInteger(feedbackId)) {
    return NextResponse.json({error: "Invalid feedback id"}, {status: 400});
  }

  try {
    const feedback = await prisma.feedback.findUnique({
      where: {id: feedbackId},
      select: {id: true, projectid: true},
    });

    if (!feedback) {
      return NextResponse.json({error: "Feedback not found"}, {status: 404});
    }

    const project = await prisma.project.findFirst({
      where: {id: feedback.projectid, userId},
      select: {id: true},
    });

    if (!project) {
      return NextResponse.json({error: "Forbidden"}, {status: 403});
    }

    await prisma.feedback.delete({where: {id: feedbackId}});

    return NextResponse.json({success: true});
  } catch (error) {
    console.error("Failed to delete feedback:", error);
    return NextResponse.json(
      {error: "Failed to delete feedback"},
      {status: 500},
    );
  }
}
