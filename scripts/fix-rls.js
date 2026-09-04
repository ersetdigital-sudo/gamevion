const postgres = require("postgres");
const sql = postgres(
  "postgresql://postgres.uncqglehccauqdxceguc:Sumedang@98@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres",
  { max: 1 }
);

async function fix() {
  try {
    const tables = ["categories", "products", "payment_methods", "contacts", "orders", "settings", "banners"];
    const roles = ["anon", "authenticated", "service_role", "postgres"];
    for (const t of tables) {
      for (const r of roles) {
        await sql.unsafe(`GRANT ALL ON ${t} TO ${r}`);
      }
      console.log("done: " + t);
    }
    console.log("\nSUCCESS!");
  } catch (e) {
    console.error("ERROR:", e.message);
  } finally {
    await sql.end();
  }
}

fix();
