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

  const target = await prisma.project.findFirst({
    where: {
      id,
      user: { email },
      status: ProjectStatus.SAVED,
    },
  });

  if (target !== null) {
    const { name, type } = await req.body;
    const updated = await prisma.project.update({
      where: { id },
      data: {
        name,
        type,
      },
    });
    return res.json(updated);
  }

  return res.status(403).send("Permission denied");
};

export default withIronSessionApiRoute(handler, sessionOptions);
