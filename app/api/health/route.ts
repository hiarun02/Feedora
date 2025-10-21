import {NextResponse} from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    // Check environment variables
    const hasJwtSecret = !!process.env.JWT_SECRET;
    const hasDatabaseUrl = !!process.env.DATABASE_URL;

    // Test database connection
    let dbConnected = false;
    try {
      await prisma.$queryRaw`SELECT 1`;
      dbConnected = true;
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
    }

    return NextResponse.json({
      status: "ok",
      environment: process.env.NODE_ENV,
      checks: {
        jwtSecret: hasJwtSecret,
        databaseUrl: hasDatabaseUrl,
        databaseConnected: dbConnected,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      {status: 500}
    );
  }
}
