"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Site } from "@/types/site";
import { SiteTable } from "@/components/dashboard/site-table";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatYesNo } from "@/lib/utils";

type Props = { initialSites: Site[] };

export function DashboardClient({ initialSites }: Props) {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [viewing, setViewing] = useState<Site | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const sortedSites = useMemo(() => [...sites].sort((a, b) => a.site.localeCompare(b.site)), [sites]);

  const handleRefresh = async () => {
    const res = await fetch("/api/sites");
    const json = await res.json();
    if (res.ok) {
      setSites(json.data || []);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  const handleView = (site: Site) => {
    setViewing(site);
    setViewOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold text-primary">Hosted By CodeChameleon</p>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              <EyeIcon className="h-7 w-7 text-primary" />
              Dashboard
            </h1>
            <p className="text-muted-foreground">Manage hosted client sites, servers, and status.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push("/dashboard/sites/new")}>
              <PlusCircleIcon className="mr-2 h-5 w-5" />
              Add site
            </Button>
          </div>
        </div>
      </div>

      <StatsCards sites={sortedSites} />
      <SiteTable
        sites={sortedSites}
        onView={handleView}
        onEdit={(site) => router.push(`/dashboard/sites/${site.id}/edit`)}
      />

      <Dialog
        open={viewOpen}
        onOpenChange={(nextOpen) => {
          setViewOpen(nextOpen);
          if (!nextOpen) {
            setViewing(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <EyeIcon className="h-5 w-5 text-primary" />
              {viewing?.site || "Site"}
            </DialogTitle>
          </DialogHeader>
          {viewing ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["Site", viewing.site],
                ["URL", viewing.url],
                ["Server", viewing.server_name],
                ["Server IP", viewing.server_ip],
                ["Premium Hosting", formatYesNo(viewing.premium_hosting)],
                ["Cloudflare", formatYesNo(viewing.cloudflare)],
                ["DMARC", viewing.dmarc_policy],
                ["SEO Monitoring", formatYesNo(viewing.seo_monitoring)],
                ["End Client", viewing.end_client],
                ["Username", viewing.username],
                ["DB Name", viewing.db_name],
                ["DB URL", viewing.db_url],
                ["Analytics Code", viewing.analytics_code],
                ["PHP Version", viewing.php_version],
                ["DNS Access", formatYesNo(viewing.dns_access)],
                ["Coverage Test", viewing.coverage_test],
                ["Origin", viewing.site_origin],
                ["Events Cal", formatYesNo(viewing.events_cal)],
                ["Rev Slider", viewing.rev_slider],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value || "—"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No site selected.</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

