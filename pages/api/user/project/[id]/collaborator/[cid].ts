import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { ProjectStatus } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.session.user === undefined) {
    return res.status(403).send("Please login");
  }
  const { email } = req.session.user;

  const id = Number(req.query["id"] as string);
  const cid = Number(req.query["cid"] as string);

  const targetProject = await prisma.project.findFirst({
    where: {
      id,
      user: { email },
      status: ProjectStatus.SAVED,
    },
    include: {
      collaborators: true,
    },
  });

  const targetCollaborator = await prisma.collaborator.findFirst({
    where: {
      id: cid,
      user: { email },
    },
  });

  if (targetProject === null || targetCollaborator === null) {
    return res.status(403).send("Permission denied");
  }

  if (req.method === "DELETE") {
    const updated = await prisma.project.update({
      where: { id },
      data: {
        collaborators: {
          disconnect: { id: cid },
        },
      },
      include: {
        collaborators: true,
      },
    });
    return res.json(updated);
  }

  if (req.method === "PUT") {
    const { email, name, attend } = await req.body;
    const updated = await prisma.$transaction(async (prisma) => {
      await prisma.collaborator.update({
        where: { id: cid },
        data: {
          email,
          name,
          attend,
        },
      });
      const updated = await prisma.project.update({
        where: { id },
        data: {
          collaborators: {
            connect: {
              id: cid,
            },
          },
        },
        include: {
          collaborators: true,
        },
      });
      return updated;
    });
    return res.json(updated);
  }

  return res.status(405).send("Method not allowed");
};

export default withIronSessionApiRoute(handler, sessionOptions);
