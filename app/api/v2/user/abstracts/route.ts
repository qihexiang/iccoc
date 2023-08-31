import prisma from "@/lib/prisma";
import apiRequireUser from "@/lib/apiRequireUser";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const email = await apiRequireUser();
    if (email instanceof Response) return email
    const abstracts = await prisma.project.findMany({
        where: {
            user: { email }
        },
        select: {
            id: true
        }
    })
    return NextResponse.json(abstracts.map(({id}) => id))
}