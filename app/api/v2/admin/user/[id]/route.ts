import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await prisma.user.findUnique({
    where: { id: Number(params.id) },
    select: {
      email: true,
      name: true,
      institution: true,
      title: true,
      userType: true,
    },
  });
  if (user === null) return NextResponse.json(null, { status: 404 });
  return NextResponse.json(user);
}
