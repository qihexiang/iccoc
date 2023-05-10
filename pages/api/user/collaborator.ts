import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next/dist";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    if (req.session.user === undefined) {
        return res.status(403).send("Please login")
    }
    const { email } = req.session.user;

    if (req.method === "GET") {
        const collaborators = await prisma.collaborator.findMany({
            where: { user: { email } }
        });
        return res.json(collaborators)
    }

    return res.status(405).send("Method not allowed")
}

export default withIronSessionApiRoute(handler, sessionOptions);