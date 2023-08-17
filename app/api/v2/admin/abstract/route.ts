import prisma from "@/lib/prisma";
import requireAdminLogin from "@/lib/requireAdminLogin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const _ = await requireAdminLogin(req);
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
