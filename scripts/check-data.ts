import postgres from "postgres";

async function main() {
  const sql = postgres(
    "postgresql://postgres.uncqglehccauqdxceguc:Sumedang@98@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres",
    { max: 1 }
  );

  const cats = await sql`SELECT name, slug FROM categories ORDER BY sort_order`;
  console.log("Categories:", cats.length);
  cats.forEach((c) => console.log(" -", c.name, c.slug));

  const prods = await sql`SELECT name, price, category_id FROM products ORDER BY sort_order LIMIT 10`;
  console.log("\nProducts (first 10):", prods.length);
  prods.forEach((p) => console.log(" -", p.name, "Rp" + p.price, p.category_id));

  const totalProds = await sql`SELECT COUNT(*) as count FROM products`;
  console.log("\nTotal products:", totalProds[0].count);

  await sql.end();
}

main().catch((e) => console.error("Error:", e.message));