import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import logger from "./logger";
import prisma from "./prisma";

export default async function requireAdminLogin(request: NextRequest) {
  logger("Into requireAdminLogin", 0)
  const adminUsername = request.cookies.get("admin");
  logger("After get cookie", 0)
  logger(JSON.stringify(adminUsername), 0)
  if (adminUsername === undefined) return redirect("/admin/login");
  if (
    (await prisma.admin.count({ where: { username: adminUsername.value } })) ===
    0
  )
    return redirect("/admin/login");
  return adminUsername;
}
