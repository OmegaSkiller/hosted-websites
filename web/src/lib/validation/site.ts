import { z } from "zod";

const optionalString = z
  .union([z.string().trim().min(1), z.string().length(0)])
  .transform((v) => (v === "" ? null : v))
  .optional()
  .nullable();

export const siteBaseSchema = z.object({
  site: z.string().trim().min(1, "Site name is required"),
  url: optionalString,
  checkup_done: optionalString,
  premium_hosting: optionalString,
  seo_monitoring: optionalString,
  views_90d: z
    .union([z.number(), z.string().transform((v) => Number(v))])
    .optional()
    .nullable()
    .transform((v) => (Number.isNaN(v as number) ? null : (v as number))),
  end_client: optionalString,
  server_name: optionalString,
  server_ip: optionalString,
  username: optionalString,
  db_name: optionalString,
  db_url: optionalString,
  cloudflare: optionalString,
  site_origin: optionalString,
  analytics_code: optionalString,
  php_version: optionalString,
  dns_access: optionalString,
  vc_wbp: optionalString,
  events_cal: optionalString,
  rev_slider: optionalString,
  coverage_test: optionalString,
  dmarc_policy: optionalString,
});

export const siteCreateSchema = siteBaseSchema;

export const siteUpdateSchema = siteBaseSchema.partial();

export type SiteFormValues = z.input<typeof siteCreateSchema>;
export type SiteCreateInput = z.output<typeof siteCreateSchema>;
export type SiteUpdateInput = z.infer<typeof siteUpdateSchema>;

