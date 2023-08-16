import forwardedParse from "forwarded-parse";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (req: NextRequest) => {
  const forward = forwardedURL(req);
  if (process.env["NODE_ENV"] === "production" && forward !== null) {
    const { host, proto } = forward;
    const url = new URL(req.url);
    url.host = host;
    url.protocol = "https:";
    url.port = "443";
    if (proto === "http") {
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
};

const forwardedURL = (req: NextRequest) => {
  const forwarded = req.headers.get("Forwarded");
  if (forwarded !== null) {
    const parsed = forwardedParse(forwarded)[0];
    const { host, proto } = parsed;
    return { host, proto };
  }

  return null;
};
