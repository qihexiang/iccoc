import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { parseToken } from "./cookieConfig";
import prisma from "./prisma";

export default async function pageRequireUser() {
    const email = parseToken(cookies().get("user")?.value)
    if (email === null) return redirect("/user/login")
    if ((await prisma.user.count({ where: { email } })) === 0) return redirect("/user/login")
    return email
}