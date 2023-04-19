import { sessionOptions } from '@/lib/session';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

async function abstractsRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user !== undefined) {
        res.status(200).json({
            ok: true,
            data: {
                user: req.session.user
            }
        })
    } else {
        res.status(403).json({
            ok: false,
            message: "Please login."
        })
    }
}

export default withIronSessionApiRoute(abstractsRoute, sessionOptions)