import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { ProjectStatus, ProjectType } from "@prisma/client";
import formidable from "formidable";
import { copyFile } from "fs/promises";
import { withIronSessionApiRoute } from "iron-session/next";
import { nanoid } from "nanoid";
import { NextApiHandler } from "next";
import { join } from "path";
import { cwd } from "process";

const handler: NextApiHandler = async (req, res) => {
    if (req.session.user === undefined) {
        return res.status(403).send("Please login")
    }
    const { email } = req.session.user;

    if (req.method === "GET") {
        const pageIndex = req.query["pageIndex"] === undefined ? Number(req.query["pageIndex"]) : 0;
        const abstracts = await prisma.project.findMany({
            skip: pageIndex * 10,
            take: 10,
        })
        return res.json(abstracts)
    }

    if (req.method === "POST") {
        const form = formidable({ multiples: false });
        const { fields, files } = await new Promise<{ fields: formidable.Fields, files: formidable.Files }>((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) {
                    reject(err)
                } else {
                    resolve({ fields, files })
                }
            })
        })

        const { projectType, projectName, projectAuthors } = fields;
        const abstractFile = files["uploaded"] as formidable.File;

        const fileId = nanoid();
        await copyFile(abstractFile.filepath, join(cwd(), "upload", fileId));
        const created = await prisma.project.create({
            data: {
                name: projectName as string,
                type: projectType as ProjectType,
                status: ProjectStatus.SAVED,
                filename: abstractFile.originalFilename ?? fileId,
                storagePath: fileId,
                user: {
                    connect: { email }
                },
                collaborators: { connect: (projectAuthors as string[]).map(Number).map(id => ({ id })) }
            }
        })

        return res.json(created)
    };

    return res.status(405).send("Method not allowed")
}

export default withIronSessionApiRoute(handler, sessionOptions)