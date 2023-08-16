import z from "zod";
import totpGenerator from "totp-generator"
import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const registrySchema = z.object({
    username: z.string().email(),
    totp: z.string().regex(/^[0-9]{6}$/)
})

export async function POST(request: NextRequest) {
    const registryInfo = await request.json();
    const validateResult = registrySchema.safeParse(registryInfo);
    if (validateResult.success === false) {
        return new Response("Bad request", { status: 400 })
    }
    const { username, totp } = validateResult.data;
    const admin = await prisma.admin.findUnique({ where: { username }, select: { secret: true } });
    if (admin === null) return new Response("Failed to login, retry later", { status: 403 })
    if (totpGenerator(admin.secret) === totp || totpGenerator(admin.secret, { timestamp: new Date().getTime() - 30 * 1000 }) === totp) {
        const cookie = cookies().set("admin", username, {
            expires: 4 * 60 * 60 * 1000, secure: process.env["NODE_ENV"] === "production"
        });
        const admin = cookie.get("admin")
        return new Response("Login success", {
            headers: {
                "Set-Cookie": `admin=${admin!.value}`
            }
        })
    }
    return new Response("Failed to login, retry later", { status: 403 })
}