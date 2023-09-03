import apiRequireAdmin from "@/lib/apiRequireAdmin";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const adminCheck = await apiRequireAdmin();
  if (adminCheck instanceof NextResponse) {
    return adminCheck;
  }
  const users = await prisma.user.findMany({
    select: { id: true },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(users);
}
