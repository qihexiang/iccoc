import { errorLog } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function abstractsRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user === undefined) {
        res.status(403).json({
            ok: false, message: "Please login."
        })
    } else {
        const { email } = req.session.user;
        try {
            const user = await prisma.user.findFirst({
                where: { email }, select: {
                    abstracts: {
                        include: {
                            authors: true
                        }
                    }
                }
            });
            if (user === null) {
                res.status(404).json({
                    ok: false, message: "User not found. Please re-login."
                })
            } else {
                res.status(200).json({
                    ok: true, data: {
                        abstracts: user.abstracts
                    }
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

export default withIronSessionApiRoute(abstractsRoute, sessionOptions)