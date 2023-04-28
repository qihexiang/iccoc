import { userDeleteAttachements, userGetAttachment } from "@/lib/user";
import { createReadStream } from "fs";
import { unlink } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import { join } from "path";
import { cwd } from "process";
import { getType } from "mime";
import HttpError from "@/lib/HttpError";
import { errorLog } from "@/lib/errors";
import { sessionOptions } from "@/lib/session";
import { withIronSessionApiRoute } from "iron-session/next";

async function attachmentRoute(req: NextApiRequest, res: NextApiResponse) {
  if (req.session.user === undefined) {
    return res.status(403).json({
      message: "Please login.",
    });
  }
  const { email } = req.session.user;

  const { id: idStr, filename } = req.query;
  const id = Number(idStr);
  if (!Number.isInteger(id) || id < 0) {
    return res.status(400).json({
      message: "Invalid abstract id.",
    });
  }

  try {
    if (req.method === "GET") {
      const fsname = await userGetAttachment(email, id, filename as string);
      const readStream = createReadStream(join(cwd(), "data", fsname));
      res.setHeader(
        "Content-Type",
        getType(filename as string) ?? "application/octect-stream"
      );
      return readStream.pipe(res);
    }

    if (req.method === "DELETE") {
      const fsname = await userGetAttachment(email, id, filename as string);
      unlink(join(cwd(), "data", fsname));
      const deleted = await userDeleteAttachements(
        email,
        id,
        filename as string
      );
      return res.json(deleted);
    }

    return res.status(405).setHeader("Allow", ["GET", "DELETE"]).json({
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
      message: "Internal server error.",
    });
  }
}

export default withIronSessionApiRoute(attachmentRoute, sessionOptions);
