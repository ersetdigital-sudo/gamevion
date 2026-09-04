import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

function generateInvoice(): string {
  const now = new Date();
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");
  const rand = Math.floor(Math.random() * 90000 + 10000);
  return `GVN-${date}-${rand}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const invoice = searchParams.get("invoice");
  const phone = searchParams.get("phone");

  let query = getSupabaseAdmin()
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (invoice) {
    query = query.ilike("invoice", `%${invoice}%`);
  } else if (phone) {
    query = query.eq("customer_phone", phone);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();

  const invoice = generateInvoice();

  const { data, error } = await getSupabaseAdmin()
    .from("orders")
    .insert({ ...body, invoice })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
