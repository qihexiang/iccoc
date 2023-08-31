import apiRequireAdmin from "@/lib/apiRequireAdmin";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

const passwdSchema = z.object({
    newPassword: z.string()
})

export async function PUT(req: NextRequest, {params}:{params: {id: string}}) {
    const admin = await apiRequireAdmin();
    if(admin === undefined) return NextResponse.json(null, {status: 403})
    const data = await req.json();
    const validated = passwdSchema.safeParse(data);
    if(validated.success) {
        const {newPassword} = validated.data
        const updated = await prisma.user.update({
            where: {id: Number(params.id)},
            data: {password: await bcrypt.hash(newPassword, 8)},
            select: {
                id: true, email: true
            }
        })
        return NextResponse.json(updated)
    }
    return NextResponse.json(null, {status: 400})
}