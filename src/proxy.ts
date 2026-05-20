import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// next-intl's createMiddleware returns the proxy function handler
const intlMiddleware = createMiddleware(routing);

// Next.js 16 uses "proxy" as the file + function name convention
export function proxy(request: Parameters<typeof intlMiddleware>[0]) {
  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except for:
  // - /api routes
  // - /_next (Next.js internals)
  // - Static files with extensions
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
