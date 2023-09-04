import prisma from "@/lib/prisma";
import apiRequireAdmin from "@/lib/apiRequireAdmin";
import { ProjectStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const idSchema = z.string().regex(/^[1-9][0-9]*$/);

export async function GET(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const isAdminCheck = await apiRequireAdmin()
  if (isAdminCheck instanceof Response) return isAdminCheck

  const idValidate = idSchema.safeParse(params.projectId);
  if (!idValidate.success) {
    return new Response("Invalid given id", { status: 400 });
  }
  const id = Number(idValidate.data);
  const abstract = await prisma.project.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          email: true,
          name: true,
          institution: true,
          phoneNumber: true,
          title: true,
        },
      },
      collaborators: true,
    },
  });
  if (abstract === null) {
    return new Response("Abstract not found", { status: 404 });
  }
  return NextResponse.json(abstract);
}

const adminUpdateSchema = z.object({
  status: z.enum([
    ProjectStatus.ACCEPTED,
    ProjectStatus.REJECTED,
    ProjectStatus.SUBMITTED,
  ]),
  rejectedWith: z.string().nullable(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: { projectId: string } }
) {
  const isAdminCheck = await apiRequireAdmin()
  if (isAdminCheck instanceof Response) return isAdminCheck

  const data = await req.json();
  const validated = adminUpdateSchema.safeParse(data);
  if (!validated.success)
    return new Response("Invalid user input", { status: 400 });
  const { status, rejectedWith } = validated.data;
  const idValidate = idSchema.safeParse(params.projectId);
  if (!idValidate.success) {
    return new Response("Invalid given id", { status: 400 });
  }
  const id = Number(idValidate.data);
  const updated = await prisma.project.update({
    where: { id },
    data: {
      status,
      rejectedWith,
    },
    select: {
      id: true,
      status: true,
      rejectedWith: true,
    },
  });
  return NextResponse.json(updated);
}