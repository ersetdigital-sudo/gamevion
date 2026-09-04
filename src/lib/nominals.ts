import { getSupabaseAdmin } from "@/lib/supabase";

export interface Nominal {
  value: number;
  label: string;
  tag?: string;
}

export async function getNominals(gameId: string): Promise<Nominal[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from("nominals")
      .select("value, label, tag")
      .eq("game_id", gameId)
      .order("sort_order");

    if (error || !data) return [];
    return data.map((n) => ({
      value: n.value,
      label: n.label,
      tag: n.tag || undefined,
    }));
  } catch {
    return [];
  }
}
