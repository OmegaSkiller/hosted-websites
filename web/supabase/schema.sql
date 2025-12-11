-- Schema for sites dashboard
create extension if not exists "uuid-ossp";

create table if not exists public.sites (
  id uuid primary key default uuid_generate_v4(),
  site text not null,
  url text,
  checkup_done text,
  premium_hosting text,
  seo_monitoring text,
  views_90d integer,
  end_client text,
  server_name text,
  server_ip text,
  username text,
  db_name text,
  db_url text,
  cloudflare text,
  site_origin text,
  analytics_code text,
  php_version text,
  dns_access text,
  vc_wbp text,
  events_cal text,
  rev_slider text,
  coverage_test text,
  dmarc_policy text,
  created_by uuid default auth.uid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists sites_server_idx on public.sites (server_name);
create index if not exists sites_url_idx on public.sites (url);
create unique index if not exists sites_url_unique on public.sites (url);

create or replace function public.set_sites_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_sites_updated_at on public.sites;
create trigger set_sites_updated_at
before update on public.sites
for each row
execute function public.set_sites_updated_at();

alter table public.sites enable row level security;

-- Allow authenticated users to read their data
create policy "Authenticated can read sites"
  on public.sites for select
  using (auth.role() = 'authenticated');

-- Allow authenticated users to insert
create policy "Authenticated can insert sites"
  on public.sites for insert
  with check (auth.role() = 'authenticated');

-- Allow authenticated users to update
create policy "Authenticated can update sites"
  on public.sites for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Allow authenticated users to delete
create policy "Authenticated can delete sites"
  on public.sites for delete
  using (auth.role() = 'authenticated');
