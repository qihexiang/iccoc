import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import { ProjectStatus } from "@prisma/client";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
    if (req.session.user === undefined) {
        return res.status(403).send("Please login")
    }
    const { email } = req.session.user;

    const id = Number(req.query["id"] as string);

    const target = await prisma.project.findFirst({
        where: {
            id, user: { email }, status: ProjectStatus.SAVED
        }, include: {
            collaborators: true
        }
    });

    if (target === null) {
        return res.status(403).send("Permission denied")
    }

    if (req.method === "POST") {
        const { email, name, } = await req.body;
        const updated = await prisma.project.update({
            where: { id },
            data: {
                collaborators: {
                    create: {
                        email, name, attend: false, user: {
                            connect: { email }
                        }
                    }
                }
            }
        })
        return res.json(updated)
    }

    return res.status(405).send("Method not allowed")
}

export default withIronSessionApiRoute(handler, sessionOptions)