import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginAdmin from "./LoginAdmin";
import pageRequireAdmin from "@/lib/pageRequireAdmin";
import { parseToken } from "@/lib/cookieConfig";

export default async function LoginPage() {
  const username = parseToken(cookies().get("admin")?.value)
  if(username !== null && (await prisma.admin.count({where: { username }})) === 1) return redirect("/admin")
  return <LoginAdmin></LoginAdmin>;
}
