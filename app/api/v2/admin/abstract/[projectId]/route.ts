import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const idSchema = z.string().regex(/^[1-9][0-9]*$/)

export async function GET(request: NextRequest, {params}: {params: {projectId: string}}) {
    const validateResult = idSchema.safeParse(params.projectId);
    if(!validateResult.success) {
        return new Response("Invalid given id", {status: 400})
    }
    const id = Number(validateResult.data)
    const abstract = await prisma.project.findUnique({
        where: {id},
        include: {
            user: {
                select: {email: true, name: true, institution: true, phoneNumber: true}
            },
            collaborators: true
        }
    });
    if (abstract === null) {
        return new Response("Abstract not found", {status: 404})
    }
    return NextResponse.json(abstract)
}