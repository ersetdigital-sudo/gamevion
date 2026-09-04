import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data, error } = await getSupabaseAdmin().auth.admin.listUsers();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const admins = data.users.map((u) => ({
    id: u.id,
    email: u.email,
    name: u.user_metadata?.name || u.email?.split("@")[0] || "",
    role: u.user_metadata?.role || "admin",
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
  }));
  return NextResponse.json(admins);
}

export async function POST(request: Request) {
  const { email, password, name } = await request.json();
  if (!email || !password || !name) {
    return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin().auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { name, role: "admin" },
  });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({
    id: data.user.id,
    email: data.user.email,
    name,
    role: "admin",
    created_at: data.user.created_at,
  });
}
