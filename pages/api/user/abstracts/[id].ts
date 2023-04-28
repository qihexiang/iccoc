import HttpError from "@/lib/HttpError";
import { errorLog } from "@/lib/errors";
import prisma from "@/lib/prisma";
import { sessionOptions } from "@/lib/session";
import {
  userDeleteAbstract,
  userGetAbstract,
  userUpdateAbstract,
} from "@/lib/user";
import { withIronSessionApiRoute } from "iron-session/next";
import { NextApiRequest, NextApiResponse } from "next";

async function abstractRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user === undefined) {
    return res.status(403).json({
      message: "Please login.",
    });
  }
  const { email } = req.session.user;

  const { id: idStr } = req.query;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id < 0) {
    return res.status(400).json({
      message: "Invalid abstract id.",
    });
  }

  try {
    // Get an abstract content
    if (req.method === "GET") {
      const abstract = await userGetAbstract(email, Number(id));
      if (abstract === null) {
        return res
          .status(404)
          .json({ message: "Target abstract content not found." });
      }
      return res.json(abstract);
    }
    // Update an abstract
    if (req.method === "PUT") {
      const data = await req.body;
      const updated = await userUpdateAbstract(email, id, data);
      return res.status(200).json(updated);
    }
    if (req.method === "DELETE") {
      const deleted = await userDeleteAbstract(email, id);
      return res.status(200).json(deleted);
    }
    return res.status(405).setHeader("Allow", ["GET", "PUT", "DELETE"]).json({
      message: "Invalid request method.",
    });
  } catch (err) {
    if (err instanceof HttpError) {
      return res.status(err.status).json({
        message: err.reason,
      });
    }

    errorLog(err);
    return res.status(500).json({
      message:
        "Internal server error, please check if all information correct and submit a few minutes later. If this still happens, please contact qihexiang@outlook.com",
    });
  }
}

export default withIronSessionApiRoute(abstractRoute, sessionOptions);
