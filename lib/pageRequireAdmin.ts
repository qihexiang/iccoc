import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { parseToken } from "./cookieConfig";
import prisma from "./prisma";

export default async function pageRequireAdmin() {
  const username = parseToken(cookies().get("admin")?.value)
  if (username === null) return redirect(`/admin/login?status=NotLogin&user=${username}`)
  if ((await prisma.admin.count({ where: { username } })) === 0) return redirect(`/admin/login?status=NoSuchUser&user=${username}`)
  return username
}
