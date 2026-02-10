import {NextResponse} from "next/server";
import {z} from "zod";
import prisma from "@/lib/db";

export const runtime = "nodejs";

const feedbackSchema = z.object({
  projectId: z.number().int().positive(),
  name: z.string().min(1).max(100),
  email: z.preprocess((value) => {
    if (typeof value === "string" && value.trim() === "") {
      return undefined;
    }
    return value;
  }, z.string().email().max(255).optional()),
  rating: z.number().int().min(0).max(5).optional(),
  feedback: z.string().min(1).max(1000),
});

const getCorsHeaders = (origin: string | null) => ({
  "Access-Control-Allow-Origin": origin ?? "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(origin),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {error: "Invalid JSON payload"},
      {status: 400, headers: getCorsHeaders(origin)},
    );
  }

  const parsed = feedbackSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {error: "Invalid request data", details: parsed.error.flatten()},
      {status: 400, headers: getCorsHeaders(origin)},
    );
  }

  const project = await prisma.project.findUnique({
    where: {id: parsed.data.projectId},
  });

  if (!project) {
    return NextResponse.json(
      {error: "Project not found"},
      {status: 404, headers: getCorsHeaders(origin)},
    );
  }

  const created = await prisma.feedback.create({
    data: {
      projectid: parsed.data.projectId,
      name: parsed.data.name,
      email: parsed.data.email ?? null,
      rating: parsed.data.rating ?? 0,
      feedback: parsed.data.feedback,
    },
  });

  return NextResponse.json(
    {feedback: created},
    {status: 201, headers: getCorsHeaders(origin)},
  );
}
