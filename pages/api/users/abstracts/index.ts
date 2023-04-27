import HttpError from '@/lib/HttpError';
import { errorLog } from '@/lib/errors';
import { sessionOptions } from '@/lib/session';
import { userCreateAbstract, userGetAbstracts } from '@/lib/user';
import { withIronSessionApiRoute } from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from 'next';

async function abstractRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user === undefined) {
        return res.status(403).json({
            ok: false, message: "Please login."
        })
    }
    const { email } = req.session.user;
    try {
        if (req.method === "GET") {
            const pageSize = req.query["pageSize"] !== undefined ? Number(req.query["pageSize"]) : 10
            const pageIndex = req.query["pageIndex"] !== undefined ? Number(req.query["pageIndex"] as string) : 0
            const data = await userGetAbstracts(email, pageSize, pageIndex);
            return res.status(200).json(data)
        }
        if (req.method === "POST") {
            const data = await req.body;
            const abstract = await userCreateAbstract(email, data)
            return res.status(200).json(abstract)
        }
        return res.status(405).setHeader("Allow", ["GET", "POST"]).json({
            message: "Invalid request method."
        })
    } catch (err) {
        if (err instanceof HttpError) {
            return res.status(err.status).json({
                message: err.reason
            })
        }
        errorLog(err)
        return res.status(500).json({
            message: "Internal server error, please check if all information correct and submit a few minutes later. If this still happens, please contact qihexiang@outlook.com"
        })
    }
}

export default withIronSessionApiRoute(abstractRoute, sessionOptions)