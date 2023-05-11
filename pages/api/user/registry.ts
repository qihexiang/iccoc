import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import bcrypt from "bcrypt";
import { passwordStrength } from "check-password-strength";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { z } from "zod";

const emailCheck = z.string().email();

const RegistryRoute: NextApiHandler = async (req, res) => {
  const { email, password, institution, phoneNumber, title, name, userType } =
    await req.body;
  if (!emailCheck.safeParse(email)) {
    return res.status(400).send("Not an email address");
  }

  if (!(passwordStrength(password).id >= 1)) {
    return res.status(400).send("Password too weak");
  }

  const encrypted = await bcrypt.hash(password, 8);

  const created = await prisma.user.create({
    data: {
      email,
      password: encrypted,
      institution,
      phoneNumber,
      title,
      name,
      userType,
    },
    select: {
      email: true,
    },
  });

  return res.json(created);
};

export default withIronSessionApiRoute(RegistryRoute, sessionOptions);
