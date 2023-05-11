import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const LoginRoute: NextApiHandler = async (req, res) => {
  const { email, password } = await req.body;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });

  if (user !== null && (await bcrypt.compare(password, user.password))) {
    req.session.user = { email };
    await req.session.save();
    res.json({
      user,
    });
  } else {
    res.status(403).json({
      message: "Invalid username(email) or password",
    });
  }
};

export default withIronSessionApiRoute(LoginRoute, sessionOptions);
