import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function usersRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user !== undefined) {
    const user = await prisma.user.findUnique({
      where: { email: req.session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        institution: true,
        userType: true,
        title: true,
        phoneNumber: true,
      },
    });

    if (user === null) {
      return res.status(404).send("User not existed");
    }

    if (req.method === "GET") {
      return res.json(user);
    }

    if (req.method === "PUT") {
      const { name, institution, userType, title, phoneNumber } =
        await req.body;
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: {
          name,
          institution,
          userType,
          title,
          phoneNumber,
        },
      });
      return res.json(updated);
    }
  }

  return res.status(403).send("Please loggin");
}

export default withIronSessionApiRoute(usersRoute, sessionOptions);
