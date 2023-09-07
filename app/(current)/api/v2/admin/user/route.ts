import apiRequireAdmin from "@/lib/apiRequireAdmin";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const adminCheck = await apiRequireAdmin();
  if (adminCheck instanceof NextResponse) {
    return adminCheck;
  }
  const users = await prisma.user.findMany({
    orderBy: { id: "desc" },
    select: {
      email: true, id: true, institution: true, phoneNumber: true, name: true
    }
  });
  return NextResponse.json(users);
}
