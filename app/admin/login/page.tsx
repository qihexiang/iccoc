import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginAdmin from "./LoginAdmin";

export default async function LoginPage() {
  const adminUsername = cookies().get("admin");
  if (
    adminUsername === undefined ||
    (await prisma.admin.count({ where: { username: adminUsername.value } }) === 0)
  ) {
    return <LoginAdmin></LoginAdmin>;
  }
  return redirect("/admin");
}
