import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      service: "guitar-companion",
      env: process.env.NODE_ENV || "production",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
