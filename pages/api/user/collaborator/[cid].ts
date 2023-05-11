import prisma from "@/lib/prisma";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.session.user === undefined) {
    return res.status(403).send("Please login");
  }
  const { email } = req.session.user;

  const cid = Number(req.query["cid"] as string);

  const target = await prisma.collaborator.findFirst({
    where: { id: cid, user: { email } },
  });

  if (target === null) {
    return res.status(404).send("Failed to find target collaborator");
  }

  if (req.method === "PUT") {
    const data = await req.body;
    const updated = await prisma.collaborator.update({
      where: { id: target.id },
      data,
    });
    return res.json(updated);
  }

  return res.status(405).send("Method not allowed.");
};
