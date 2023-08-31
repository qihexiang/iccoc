import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginUser from "./LoginUser";
import { parseToken } from "@/lib/cookieConfig";

export default async function LoginPage() {
  const email = parseToken(cookies().get("user")?.value)
  if(email !== null && (await prisma.user.count({where: {email}})) === 1) return redirect("/user");
  return <LoginUser></LoginUser>
}
