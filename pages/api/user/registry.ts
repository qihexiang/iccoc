import { errorLog } from "@/lib/errors";
import { sessionOptions } from "@/lib/session";
import { createUser } from "@/lib/user";
import { passwordStrength } from "check-password-strength";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const emailCheck = z.string().email();

async function registryRoute(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email, password } = await req.body;
    if (passwordStrength(password).id === 0) {
      return res.status(400).json({
        message: "Invalid password: Too weak.",
      });
    }
    if (!emailCheck.safeParse(email).success) {
      return res.status(400).json({
        message: "Invalid given email: Not an email address",
      });
    }
    await createUser(email, password);
    req.session.user = {
      email,
    };
    await req.session.save();
    return res.status(200).json({
      user: {
        email,
      },
    });
  } catch (err) {
    errorLog(err);
    return res.status(500).json({
      message: "Failed to create account. Please check your email address.",
    });
  }
}

export default withIronSessionApiRoute(registryRoute, sessionOptions);
