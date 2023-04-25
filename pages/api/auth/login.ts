<<<<<<< HEAD
import { userPasswordHmac } from '@/lib/crypto';
import { errorLog } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = await req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: username,
                password: userPasswordHmac(password)
            },
            select: {
                email: true, password: false
            }
        })
        if (user === null) {
            res.status(403).json({
                ok: false,
                message: "Invalid username(email) or password"
            })
        } else {
            req.session.user = user;
            await req.session.save()
            res.send({
                ok: true,
                data: {
                    user
                }
            })
        }
    } catch(err) {
        errorLog(err)
        res.status(500).json({
            ok: false,
            message: "Internal server error, please check if all information correct and submit a few minutes later. If this still happens, please contact qihexiang@outlook.com"
        })
    }
}

=======
import { userPasswordHmac } from '@/lib/crypto';
import { errorLog } from '@/lib/errors';
import prisma from '@/lib/prisma';
import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    const { username, password } = await req.body;
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: username,
                password: userPasswordHmac(password)
            },
            select: {
                email: true, password: false
            }
        })
        if (user === null) {
            res.status(403).json({
                ok: false,
                message: "Invalid username(email) or password"
            })
        } else {
            req.session.user = user;
            await req.session.save()
            res.send({
                ok: true,
                data: {
                    user
                }
            })
        }
    } catch(err) {
        errorLog(err)
        res.status(500).json({
            ok: false,
            message: "Internal server error, please check if all information correct and submit a few minutes later. If this still happens, please contact qihexiang@outlook.com"
        })
    }
}

>>>>>>> dev
export default withIronSessionApiRoute(loginRoute, sessionOptions)