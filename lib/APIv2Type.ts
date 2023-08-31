import { NextResponse } from "next/server";

type APIv2Type<T extends (...args: any[]) => any> = Awaited<ReturnType<T>> extends NextResponse<infer N> ? NonNullable<N> : never

export default APIv2Type