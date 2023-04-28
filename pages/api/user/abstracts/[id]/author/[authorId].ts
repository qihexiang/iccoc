import HttpError from "@/lib/HttpError";
import { errorLog } from "@/lib/errors";
import { sessionOptions } from "@/lib/session";
import { userRemoveAuthor, userUpdateAuthor } from "@/lib/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function authorRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.session.user === undefined) {
        return res.status(403).json({
            ok: false, message: "Please login."
        })
    }
    const { email } = req.session.user;

    const { id: idStr, authorId: authorIdStr } = req.query;
    const id = Number(idStr);
    const authorId = Number(authorIdStr);
    if (![id, authorId].every(value => Number.isInteger(value) && value > 0)) {
        return res.status(400).json({
            message: "Invalid abstract id or author id."
        })
    }

    try {
        if (req.method === "PUT") {
            const data = await req.body;
            const updated = await userUpdateAuthor(email, id, authorId, data);
            return res.json(updated)
        }

        if (req.method === "DELETE") {
            const deleted = await userRemoveAuthor(email, id, authorId);
            return res.json(deleted)
        }

        return res.status(405).setHeader("Allow", ["PUT", "DELETE"]).json({
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
            message: "Internal server error."
        })
    }
}

export default withIronSessionApiRoute(authorRoute, sessionOptions)