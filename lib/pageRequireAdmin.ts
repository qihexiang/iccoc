import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseToken } from "./cookieConfig";
import prisma from "./prisma";

export default async function apiRequireAdmin() {
  const adminCookie = cookies().get("admin")
  if (adminCookie === undefined) return redirect("/admin/login")
  const username = parseToken(adminCookie.value)
  if (username === null) return redirect("/admin/login")
  if ((await prisma.admin.count({ where: { username } })) === 0) return redirect("/admin/login")
  return adminCookie.value
}
