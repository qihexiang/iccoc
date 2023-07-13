import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { UserType } from "@prisma/client";
import bcrypt from "bcrypt";
import { passwordStrength } from "check-password-strength";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";
import { z } from "zod";

const registryValidator = z.object({
  email: z.string().email("Email must be a valid email address"),
  name: z.string().regex(/^[^\s].*[^\s]$/, "Your name must start and end with non-empty characters"),
  password: z.string(),
  phoneNumber: z.string().regex(/[\+\-\s0-9]*/, "Phone number can include +, - and numbers between 0-9"),
  title: z.string().max(255, "Title too long."),
  institution: z.string().max(255, "Institution too long."),
  userType: z.nativeEnum(UserType)
})

const emailCheck = z.string().email();

const RegistryRoute: NextApiHandler = async (req, res) => {
  const fromClient = registryValidator.safeParse(await req.body);
  if (!fromClient.success) {
    const errorMessages = JSON.parse(fromClient.error.message).map((err: {message: string}) => err.message).join("\n")
    return res.status(400).send(errorMessages)
  }
  const { email, password, institution, phoneNumber, title, name, userType } = fromClient.data;

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
