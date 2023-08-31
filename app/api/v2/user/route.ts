import prisma from "@/lib/prisma";
import apiRequireUser from "@/lib/apiRequireUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const email = await apiRequireUser();
    if(email instanceof Response) return email;

    const data = await prisma.user.findUnique({
        where: { email: email },
        select: {
            email: true, phoneNumber: true, name: true, institution: true, title: true,
        }
    })
    if (data === null) return new Response(null, {status: 404})
    return NextResponse.json(data)
}