import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CANONICAL_HOST = "rezabarzakhi.ir";
const LEGACY_MEDIA_PREFIX = "/wp-content/";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const hostname = host.split(":")[0].toLowerCase();
  const { pathname } = request.nextUrl;
  if (hostname === `www.${CANONICAL_HOST}` && !pathname.startsWith(LEGACY_MEDIA_PREFIX)) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
