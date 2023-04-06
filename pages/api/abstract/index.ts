import { errorLog } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { abstractSchema } from '@/pages/activities/panel';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

async function abstractRoute(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;
    if (req.session.user === undefined) {
        res.status(403).json({
            ok: false, message: "Please login."
        })
    } else {
        const { email } = req.session.user;
        try {
            if (req.method === "POST") {
                const data = await req.body;
                const { title, content, authors } = data;
                const abstract = await prisma.abstract.create({
                    data: {
                        title, content, authors: {
                            createMany: authors
                        }, user: {
                            connect: {
                                email
                            }
                        }
                    }
                })
                res.status(200).json({
                    ok: true, data: {
                        abstract
                    }
                })
            } else {
                res.status(405).setHeader("Allow", ["POST"]).json({
                    ok: false, message: "Invalid request method."
                })
            }
        } catch (err) {
            errorLog(err)
            res.status(500).json({
                ok: false,
                message: "Internal server error, please check if all information correct and submit a few minutes later. If this still happens, please contact qihexiang@outlook.com"
            })
        }
    }
}

export default withIronSessionApiRoute(abstractRoute, sessionOptions)