import prisma from "@/lib/prisma";
import apiRequireUser from "@/lib/apiRequireUser";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const idSchema = z.string().regex(/^[1-9][0-9]*$/);

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const email = apiRequireUser();

    if (email instanceof Array) return email

    const idValidate = idSchema.safeParse(params.id);
    if (!idValidate.success) return new Response("Invalid given id", { status: 400 });
    const id = Number(idValidate.data);

    const abstract = await prisma.project.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    email: true,
                    name: true,
                    institution: true,
                    phoneNumber: true,
                    title: true,
                },
            },
            collaborators: true,
        },
    });
    if (abstract === null) {
        return new Response("Abstract not found", { status: 404 });
    }
    return NextResponse.json(abstract);
}