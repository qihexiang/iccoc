import apiRequireAdmin from "@/lib/apiRequireAdmin";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const isAdminCheck = await apiRequireAdmin()
  if (isAdminCheck instanceof Response) return isAdminCheck

  const projects = await prisma.project.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json(projects.map(({ id }) => id));
}
