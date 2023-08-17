import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import prisma from "./prisma";

export default async function requireAdminLogin(request: NextRequest) {
  const adminUsername = request.cookies.get("admin");
  console.log(adminUsername?.value)
  if (adminUsername === undefined) redirect("/admin/login");
  if (
    (await prisma.admin.count({ where: { username: adminUsername.value } })) ===
    0
  )
    redirect("/admin/login");
  return adminUsername;
}
