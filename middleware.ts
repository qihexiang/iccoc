import { NextRequest, NextResponse } from "next/server";
import forwardedParse from "forwarded-parse";

export const middleware = (req: NextRequest) => {
  if (process.env["NODE_ENV"] === "production") {
    const forwarded = forwardedURL(req);
    const origin =
      forwarded !== null ? new URL(req.nextUrl, forwarded) : new URL(req.url);
    if (origin.protocol !== "https:") {
      origin.protocol = "https:";
      return NextResponse.redirect(origin);
    }
  }

  return NextResponse.next();
};

const forwardedURL = (req: NextRequest) => {
  const forwarded = req.headers.get("Fowarded");
  if (forwarded !== null) {
    const parsed = forwardedParse(forwarded)[0];
    return `${parsed.proto}://${parsed.host}`;
  }

  return null;
};
