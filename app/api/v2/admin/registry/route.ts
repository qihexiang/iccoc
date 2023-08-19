import z from "zod";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import apiRequireAdmin from "@/lib/apiRequireAdmin";

const registrySchema = z.object({
  username: z.string().email(),
  secret: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const admin = request.cookies.get("admin");
  const registryInfo = await request.json();
  const validateResult = registrySchema.safeParse(registryInfo);
  if (validateResult.success === false) {
    return new Response("Bad request", { status: 400 });
  }
  const { username, secret } = validateResult.data;

  const isAdminCheck = await apiRequireAdmin()

  if (
    typeof isAdminCheck === "string" ||
    (await prisma.admin.count()) === 0
  ) {
    const newAdmin = await prisma.admin.create({
      data: {
        username,
        secret,
      },
      select: { id: true },
    });
    return new Response(`${newAdmin.id}`);
  }
  return new Response("Permission denied", { status: 403 });
}
