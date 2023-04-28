import { errorLog } from '@/lib/errors';
import { sessionOptions } from '@/lib/session';
import { createUser } from '@/lib/user';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

async function registryRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { email, password } = await req.body;
        await createUser(email, password);
        req.session.user = {
            email
        };
        await req.session.save()
        res.status(200).json({
            ok: true,
            data: {
                user: {
                    email
                }
            }
        })
    } catch (err) {
        errorLog(err)
        res.status(500).json({
            ok: false,
            message: "Failed to create account. Please check your email address."
        })
    }
}

export default withIronSessionApiRoute(registryRoute, sessionOptions)