import { userPasswordHmac } from "@/lib/crypto";
import { errorLog } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { checkUser } from "@/lib/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = await req.body;
    const user = await checkUser(email, password);
    if (user) {
      req.session.user = { email };
      await req.session.save();
      res.json({
        user,
      });
    } else {
      res.status(403).json({
        ok: false,
        message: "Invalid username(email) or password",
      });
    }
  } catch (err) {
    errorLog(err);
    res.status(400).json({
      message: "Invalid user input, please retry.",
    });
  }
}

export default withIronSessionApiRoute(loginRoute, sessionOptions);
