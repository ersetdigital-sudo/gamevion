import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-middleware";

export async function middleware(request: NextRequest) {
  // Skip API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    return;
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};