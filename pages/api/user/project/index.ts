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

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler: NextApiHandler = async (req, res) => {
  if (req.session.user === undefined) {
    return res.status(403).send("Please login");
  }
  const { email } = req.session.user;

  if (req.method === "GET") {
    const pageIndex =
      req.query["pageIndex"] !== undefined ? Number(req.query["pageIndex"]) : 0;
    const projects = await prisma.project.findMany({
      where: { user: { email } },
      skip: pageIndex * 10,
      take: 10,
      include: {
        collaborators: true,
      },
    });
    return res.json(projects);
  }

  if (req.method === "POST") {
    const form = formidable({ multiples: false });
    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });

    const { type, name } = fields;
    const abstractFile = files["upload"] as formidable.File;

    const fileId = nanoid();
    await copyFile(abstractFile.filepath, join(cwd(), "upload", fileId));
    const created = await prisma.project.create({
      data: {
        name: name as string,
        type: type as ProjectType,
        status: ProjectStatus.SAVED,
        filename: abstractFile.originalFilename ?? fileId,
        storagePath: fileId,
        user: {
          connect: { email },
        },
      },
      include: {
        collaborators: true,
      },
    });

    return res.json(created);
  }

  return res.status(405).send("Method not allowed");
};

export default withIronSessionApiRoute(handler, sessionOptions);
