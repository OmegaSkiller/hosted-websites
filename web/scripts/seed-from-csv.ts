import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { parse } from "csv-parse/sync";
import { createClient } from "@supabase/supabase-js";
import { siteCreateSchema, type SiteCreateInput } from "../src/lib/validation/site";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  const csvPath = path.join(process.cwd(), "data", "hosted_sited_export.csv");
  const content = fs.readFileSync(csvPath, "utf8");
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Record<string, string>[];

  const normalized = records
    .map((row) => {
      const entry: SiteCreateInput = {
        site: row["Site"] || "",
        url: row["URL"] || null,
        checkup_done: row["Site Checkup Done?"] || null,
        premium_hosting: row["Premium Hosting"] || null,
        seo_monitoring: row["SEO Monitoring"] || null,
        views_90d: row["90 day views"] ? Number(row["90 day views"]) : null,
        end_client: row["End Client"] || null,
        server_name: row["New Server"] || null,
        server_ip: row["IP Address"] || null,
        username: row["Username"] || null,
        db_name: row["DB Name"] || null,
        db_url: row["DB URL"] || null,
        cloudflare: row["Cloudflare?"] || null,
        site_origin: row["Site Origin"] || null,
        analytics_code: row["Analytics Team Code"] || null,
        php_version: row["PHP V."] || null,
        dns_access: row["DNS Access?"] || null,
        vc_wbp: row["VC/WBP?"] || null,
        events_cal: row["Events Cal?"] || null,
        rev_slider: row["Rev. Slider?"] || null,
        coverage_test: row["Coverage Test?"] || null,
        dmarc_policy: row["DMARC Policy"] || null,
      };

    const parsed = siteCreateSchema.safeParse(entry);
    if (!parsed.success) {
      console.warn("Skipped invalid row", row["Site"], parsed.error.flatten().fieldErrors);
      return null;
    }
      return parsed.data;
    })
    .filter(Boolean) as SiteCreateInput[];

  if (normalized.length === 0) {
    console.log("No valid rows to insert.");
    return;
  }

  const { error, count } = await supabase.from("sites").upsert(normalized, { onConflict: "url" }).select("*", { count: "exact" });
  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${count ?? normalized.length} records into sites.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

