import prisma from "@/lib/prisma";
import requireAdminLogin from "@/lib/requireAdminLogin";
import { NextRequest, NextResponse } from "next/server";
import { createReadStream } from "node:fs";
import { Readable } from "node:stream";
import { stat } from "node:fs/promises";
import { join } from "node:path";
import { idSchema } from "../route";

export async function GET(req: NextRequest, {params}: {params: {projectId: string}}) {
    const _ = await requireAdminLogin(req);
    const idValidate = idSchema.safeParse(params.projectId);
    if (!idValidate.success) {
        return new Response("Invalid given id", { status: 400 })
    }
    const id = Number(idValidate.data)
    const abstract = await prisma.project.findUnique({
        where: {id}, select: {
            storagePath: true
        }
    })
    if (abstract === null) return new Response("Failed to load file", {status: 403})
    const fullPath = join(process.cwd(), "upload", abstract.storagePath)
    const fileStat = await stat(fullPath).catch(() => null)
    if (fileStat === null) return new Response("Failed to load file", {status: 403})
    const stream = Readable.toWeb(createReadStream(fullPath)) as ReadableStream<Uint8Array>
    return new NextResponse(stream)
}