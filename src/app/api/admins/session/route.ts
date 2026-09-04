import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("session") === "true") {
    // Return current user from cookie-based session
    const { data, error } = await getSupabaseAdmin().auth.getUser();
    if (error || !data.user) {
      return NextResponse.json({ email: null });
    }
    return NextResponse.json({ email: data.user.email });
  }
  return NextResponse.json({ email: null });
}
