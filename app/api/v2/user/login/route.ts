import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs"
import { cookies } from "next/headers";
import cookieConfig, { generateToken } from "@/lib/cookieConfig";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
})

export async function POST(req: NextRequest) {
    const data = await req.json();
    const validated = loginSchema.safeParse(data);
    if (!validated.success) return new Response("Invalid user input", { status: 400 })
    const { email, password } = validated.data;
    const targetUser = await prisma.user.findUnique({
        where: { email },
        select: { password: true }
    })
    if (targetUser === null) return new Response("Email or password error", { status: 403 })
    if (!(await bcrypt.compare(password, targetUser.password))) return new Response("Email or password error", {status: 403})
    const userCookie = cookies().set("user", generateToken(email), cookieConfig)
    return new Response("Success", {headers: {
        "Set-Cookie": userCookie.toString()
    }})
}

export function DELETE() {
    return new Response("Success", {
        headers: {
            "Set-Cookie": cookies().set("user", "", {...cookieConfig, expires: new Date().getTime() - 1000}).toString()
        }
    })
}