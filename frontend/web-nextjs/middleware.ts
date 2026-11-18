import { NextResponse, type NextRequest } from "next/server";

/**
 * MarketPay frontend access routing.
 *
 * Development UI Preview bypasses authentication so designers and testers can
 * inspect every role workspace without requiring an API or JWT cookie.
 * NEVER enable preview mode in a deployed production environment.
 *
 * Authorization of actual data and financial operations must be enforced by
 * the backend/API gateway. Decoding a cookie here is only a routing hint; it
 * is NOT JWT signature validation.
 */
const workspacePrefixes = ["consumer", "vendor", "wholesaler", "rider", "government", "admin"] as const;
const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/mfa", "/offline"];

function previewEnabled(): boolean {
  return process.env.NODE_ENV === "development" && process.env.MARKETPAY_UI_PREVIEW !== "false";
}

function normalizedRole(role: unknown): string | null {
  if (typeof role !== "string") return null;
  const aliases: Record<string, string> = {
    retailer: "vendor",
    gov_analyst: "government",
  };
  const normalized = aliases[role] ?? role;
  return workspacePrefixes.some((prefix) => prefix === normalized) ? normalized : null;
}

function readRoleFromToken(token: string): string | null {
  try {
    const encoded = token.split(".")[1];
    if (!encoded) return null;
    const payload = JSON.parse(atob(encoded.replace(/-/g, "+").replace(/_/g, "/")));
    return normalizedRole(payload.role);
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (publicRoutes.includes(pathname)) return NextResponse.next();

  // Preview is automatically enabled for `next dev`, unless explicitly disabled.
  // It is impossible to activate via this setting in a production build.
  if (previewEnabled()) return NextResponse.next();

  const workspace = pathname.split("/")[1];
  if (!workspacePrefixes.some((prefix) => prefix === workspace)) {
    return NextResponse.next(); // Let Next.js handle unknown paths (404).
  }

  const accessToken = request.cookies.get("access_token")?.value;
  if (!accessToken) return NextResponse.redirect(new URL("/login", request.url));

  const role = readRoleFromToken(accessToken);
  if (!role) return NextResponse.redirect(new URL("/login", request.url));

  if (role !== "admin" && workspace !== role) {
    return NextResponse.redirect(new URL(`/${role}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|favicon.ico|.*\\..*).*)"],
};
