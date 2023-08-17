import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

const LoginRoute: NextApiHandler = async (req, res) => {
  const data = await req.body;
  const validated = loginSchema.safeParse(data);

  if (!validated.success) return res.status(400).send("Invalid input")

  const { email, password } = validated.data

  const user = await prisma.user.findUnique({
    where: { email },
    select: { password: true },
  });

  if (user !== null && (await bcrypt.compare(password, user.password))) {
    req.session.user = { email };
    await req.session.save();
    logger(`User Login: ${email}`, 2)
    res.json({
      user,
    });
  } else {
    logger(`Failed Login: ${email}`, 4)
    res.status(403).json({
      message: "Invalid username(email) or password",
    });
  }
};

export default withIronSessionApiRoute(LoginRoute, sessionOptions);
