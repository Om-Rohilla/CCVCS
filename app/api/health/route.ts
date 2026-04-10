import { NextResponse } from "next/server";

export const GET = async () =>
  NextResponse.json({
    status: "ok",
    service: "ccvcs",
    timestamp: new Date().toISOString(),
  });
