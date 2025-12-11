export type Site = {
  id: string;
  site: string;
  url: string | null;
  checkup_done: string | null;
  premium_hosting: string | null;
  seo_monitoring: string | null;
  views_90d: number | null;
  end_client: string | null;
  server_name: string | null;
  server_ip: string | null;
  username: string | null;
  db_name: string | null;
  db_url: string | null;
  cloudflare: string | null;
  site_origin: string | null;
  analytics_code: string | null;
  php_version: string | null;
  dns_access: string | null;
  vc_wbp: string | null;
  events_cal: string | null;
  rev_slider: string | null;
  coverage_test: string | null;
  dmarc_policy: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
};

