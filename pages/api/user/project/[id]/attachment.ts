import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { ProjectStatus } from "@prisma/client";
import formidable from "formidable";
import { copyFile } from "fs/promises";
import { withIronSessionApiRoute } from "iron-session/next";
import { nanoid } from "nanoid";
import { NextApiHandler } from "next";
import { join } from "path";
import { cwd } from "process";

export const config = {
    api: {
        bodyParser: false
    }
}

const handler: NextApiHandler = async (req, res) => {
    if (req.session.user === undefined) {
        return res.status(403).send("Please login")
    }
    const { email } = req.session.user;

    const id = Number(req.query["id"] as string);

    const target = await prisma.project.findFirst({
        where: {
            id, user: { email }, status: ProjectStatus.SAVED
        }
    });

    if (target === null) {
        return res.status(403).send("Permission denied")
    }

    const form = formidable({ multiples: false, maxFileSize: 32 * 1024 * 1024 });
    const files = await new Promise<formidable.Files>((resolve, reject) => {
        form.parse(req, (err, _, files) => {
            if (err) {
                reject(err)
            } else {
                resolve(files)
            }
        })
    })

    if ("updated" in files) {
        const file = files["updated"] as formidable.File;
        const fileId = nanoid();
        await copyFile(file.filepath, join(cwd(), "upload", fileId));
        const updated = await prisma.project.update({
            where: { id },
            data: {
                filename: file.originalFilename ?? fileId,
                storagePath: fileId
            }
        })
        return updated
    }

    return res.status(400).send("Bad uploaded file")
}

export default withIronSessionApiRoute(handler, sessionOptions)