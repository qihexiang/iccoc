import { userPasswordHmac } from '@/lib/crypto';
import { errorLog } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from 'next'

async function registryRoute(req: NextApiRequest, res: NextApiResponse) {
    const { email, password } = await req.body;
    try {
        const existedEmail = await prisma.user.findFirst({
            where: { email }, select: {}
        });
        if (existedEmail !== null) {
            const createdUser = await prisma.user.create({
                data: {
                    email, password: userPasswordHmac(password)
                }
            });
            res.status(200).json({
                ok: true,
                data: {
                    user: {
                        email: createdUser.email
                    }
                }
            })
        } else {
            res.status(403).json({
                ok: false,
                message: "E-mail address already in use."
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

export default withIronSessionApiRoute(registryRoute, sessionOptions)