import { NextRequest } from "next/server";
import prisma from "./prisma";

export default async function requireAdminLogin(request: NextRequest) {
  const adminUsername = request.cookies.get("admin");
  if (adminUsername === undefined) return new Response(null, { status: 403 });
  if (
    (await prisma.admin.count({ where: { username: adminUsername.value } })) ===
    0
  ) return new Response(null, { status: 403 })
  return adminUsername.value
}
