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
      hotelBooking: true,
    },
  });
  if (user === null) return res.status(403).send("Permission denied");

  if (req.method === "GET") {
    if (user.hotelBooking === null) return res.status(200).json(null);
    return res.json(user.hotelBooking);
  }

  if (req.method === "PUT") {
    const { checkinDate, checkoutDate, standardRooms, kingRooms, location } =
      await req.body;
    if (user.hotelBooking === null) {
      const created = await prisma.hotelBooking.create({
        data: {
          checkinDate: new Date(checkinDate),
          checkoutDate: new Date(checkoutDate),
          standardRooms,
          kingRooms,
          location,
          user: { connect: { id: user.id } },
        },
      });
      return res.json(created);
    }
    const updated = await prisma.hotelBooking.update({
      where: { userId: user.id },
      data: {
        checkinDate: new Date(checkinDate),
        checkoutDate: new Date(checkoutDate),
        standardRooms,
        kingRooms,
        location,
      },
    });
    return res.json(updated);
  }

  if (req.method === "DELETE") {
    if(user.hotelBooking === null) return res.json({message: "OK"})
    
    await prisma.hotelBooking.delete({
      where: {userId: user.id}
    });
    return res.json({message: "OK"})
  }

  return res.status(405).send("Method not allowed.");
};

export default withIronSessionApiRoute(TravelRoute, sessionOptions);
