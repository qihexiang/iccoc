import { NextApiHandler } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";
import prisma from "@/lib/prisma";

const TravelRoute: NextApiHandler = async (req, res) => {
  if (req.session.user === undefined) {
    return res.status(403).send("Permission denied");
  }
  const email = req.session.user.email;

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      travel: true,
    },
  });
  if (user === null) return res.status(403).send("Permission denied");

  if (req.method === "GET") {
    if (user.travel === null) return res.status(200).json(null);
    return res.json(user.travel);
  }

  if (req.method === "PUT") {
    const { arrivalDate, arrivalNo, departureDate, departureNo, attendVisit } =
      await req.body;
    if (user.travel === null) {
      const created = await prisma.travel.create({
        data: {
          arrivalDate: new Date(arrivalDate),
          arrivalNo,
          departureDate: new Date(departureDate),
          departureNo,
          attendVisit,
          user: { connect: { id: user.id } },
        },
      });
      return res.json(created);
    }
    const updated = await prisma.travel.update({
      where: { userId: user.id },
      data: {
        arrivalDate: new Date(arrivalDate),
        arrivalNo,
        departureDate: new Date(departureDate),
        departureNo,
        attendVisit,
      },
    });
    return res.json(updated);
  }
  return res.status(405).send("Method not allowed.");
};

export default withIronSessionApiRoute(TravelRoute, sessionOptions);
