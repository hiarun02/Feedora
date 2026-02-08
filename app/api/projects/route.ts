import {NextResponse} from "next/server";
import {z} from "zod";
import {auth} from "@/lib/auth";
import prisma from "@/lib/db";
export const runtime = "nodejs";

// Validation schema
const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  url: z.string().min(1).max(255),
});

export async function POST(request: Request) {
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

  const parsed = createProjectSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {error: "Invalid request data", details: parsed.error.flatten()},
      {status: 400},
    );
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId)) {
    return NextResponse.json({error: "Invalid user session"}, {status: 400});
  }

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      userId,
    },
  });

  return NextResponse.json({project}, {status: 201});
}

// Get all projects api
export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({error: "Unauthorized"}, {status: 401});
  }

  const userId = Number(session.user.id);

  if (!Number.isInteger(userId)) {
    return NextResponse.json({error: "Invalid user session"}, {status: 400});
  }

  const projects = await prisma.project.findMany({
    where: {userId},
    orderBy: {createdAt: "desc"},
  });

  return NextResponse.json({projects}, {status: 200});
}
