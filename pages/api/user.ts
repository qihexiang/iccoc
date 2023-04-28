import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function usersRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user !== undefined) {
    res.status(200).json({
      user: req.session.user,
    });
  } else {
    res.status(403).json({ message: "Please login." });
  }
}

export default withIronSessionApiRoute(usersRoute, sessionOptions);
