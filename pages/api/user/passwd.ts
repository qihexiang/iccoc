import prisma from "@/lib/prisma";
import { NextApiHandler } from "next";
import { z } from "zod";
import bcrypt from "bcryptjs"
import { withIronSessionApiRoute } from "iron-session/next";
import { sessionOptions } from "@/lib/session";

const passwdSchema = z.object({
    password: z.string()
})

const PasswdHandler: NextApiHandler = async (req, res) => {
    if (req.session.user === undefined) {
      return res.status(403).send("Permission denied");
    }
    const email = req.session.user.email;
    const data = await req.body;
    const validated = passwdSchema.safeParse(data);
    if(validated.success) {
        const {password} = validated.data;
        const updated = await prisma.user.update({
            where: {
                email
            },
            data: {
                password: await bcrypt.hash(password, 8)
            },
            select: {
                email: true
            }
        })
        return res.json(updated)
    }

    return res.status(400).json(null)
}

export default withIronSessionApiRoute(PasswdHandler, sessionOptions)