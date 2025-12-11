import { ChartPieIcon, CloudArrowUpIcon, EnvelopeOpenIcon, ShieldCheckIcon, ServerStackIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, getServerBadgeClasses } from "@/lib/utils";
import { Site } from "@/types/site";

type Props = {
  sites: Site[];
};

export function StatsCards({ sites }: Props) {
  const total = sites.length;
  const premium = sites.filter((s) => (s.premium_hosting || "").toLowerCase() === "yes").length;
  const cloudflare = sites.filter((s) => (s.cloudflare || "").toLowerCase() === "yes").length;
  const dmarc = sites.filter((s) => s.dmarc_policy && s.dmarc_policy.length > 0).length;

  const byServer = sites.reduce<Record<string, number>>((acc, site) => {
    if (!site.server_name) return acc;
    acc[site.server_name] = (acc[site.server_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChartPieIcon className="h-5 w-5 text-primary" />
            Total Sites
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Across all servers</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheckIcon className="h-5 w-5 text-primary" />
            Premium Hosting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{premium}</p>
          <p className="text-sm text-muted-foreground">with premium hosting</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CloudArrowUpIcon className="h-5 w-5 text-primary" />
            Cloudflare
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{cloudflare}</p>
          <p className="text-sm text-muted-foreground">protected domains</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <EnvelopeOpenIcon className="h-5 w-5 text-primary" />
            DMARC
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{dmarc}</p>
          <p className="text-sm text-muted-foreground">with DMARC policy</p>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 xl:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ServerStackIcon className="h-5 w-5 text-primary" />
            Servers
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(byServer).map(([server, count]) => (
            <Badge key={server} className={cn("border px-3 py-1 text-sm", getServerBadgeClasses(server))}>
              {server}: {count}
            </Badge>
          ))}
          {Object.keys(byServer).length === 0 && (
            <span className="text-sm text-muted-foreground">No server data</span>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

