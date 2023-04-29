import { getCount } from "@/lib/redis";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { nanoid } from "nanoid";
import { NextApiRequest, NextApiResponse } from "next";

async function counterRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const count = await getCount(req.session.count);
    if (req.session.count === undefined) {
      req.session.count = nanoid();
      await req.session.save();
    }
    return res.json({
      count,
    });
  }

  return res.status(405).setHeader("Allow-Headers", ["GET"]).json({
    message: "Invalid request method.",
  });
}

export default withIronSessionApiRoute(counterRoute, sessionOptions);
