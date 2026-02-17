import {NextResponse} from "next/server";
import {z} from "zod";
import {auth} from "@/lib/auth";
import prisma from "@/lib/db";

export const runtime = "nodejs";

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  url: z.string().min(1).max(255),
});

// GET /api/projects/:id - Get project details
export async function GET(
  _request: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const userId = Number(session.user.id);

  const {id} = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return NextResponse.json({error: "Invalid project ID"}, {status: 400});
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      return NextResponse.json({error: "Project not found"}, {status: 404});
    }

    return NextResponse.json({project}, {status: 200});
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return NextResponse.json({error: "Failed to fetch project"}, {status: 500});
  }
}

// PATCH /api/projects/:id - Update project details
export async function PATCH(
  request: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({error: "Invalid JSON payload"}, {status: 400});
  }

  const parsed = updateProjectSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {error: "Invalid request data", details: parsed.error.flatten()},
      {status: 400},
    );
  }

  const userId = Number(session.user.id);

  const {id} = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return NextResponse.json({error: "Invalid project ID"}, {status: 400});
  }

  try {
    const existing = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json({error: "Project not found"}, {status: 404});
    }

    const project = await prisma.project.update({
      where: {id: projectId},
      data: parsed.data,
    });

    return NextResponse.json({project}, {status: 200});
  } catch (error) {
    console.error("Failed to update project:", error);
    return NextResponse.json(
      {error: "Failed to update project"},
      {status: 500},
    );
  }
}

// DELETE /api/projects/:id - Delete a project
export async function DELETE(
  _request: Request,
  {params}: {params: Promise<{id: string}>},
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const userId = Number(session.user.id);

  const {id} = await params;
  const projectId = Number(id);

  if (!Number.isInteger(projectId)) {
    return NextResponse.json({error: "Invalid project ID"}, {status: 400});
  }

  try {
    const existing = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!existing) {
      return NextResponse.json({error: "Project not found"}, {status: 404});
    }

    await prisma.project.delete({where: {id: projectId}});

    return NextResponse.json({ok: true}, {status: 200});
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json(
      {error: "Failed to delete project"},
      {status: 500},
    );
  }
}
