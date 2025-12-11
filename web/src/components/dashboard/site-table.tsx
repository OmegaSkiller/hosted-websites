import { useMemo, useState } from "react";
import {
  CloudIcon,
  EnvelopeOpenIcon,
  EyeIcon,
  GlobeAltIcon,
  LinkIcon,
  PencilSquareIcon,
  ServerStackIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatYesNo, getServerBadgeClasses, isTruthyFlag } from "@/lib/utils";
import { Site } from "@/types/site";

type Props = {
  sites: Site[];
  onView: (site: Site) => void;
  onEdit: (site: Site) => void;
};

export function SiteTable({ sites, onView, onEdit }: Props) {
  const [search, setSearch] = useState("");
  const [serverFilter, setServerFilter] = useState<string>("all");
  const [premiumOnly, setPremiumOnly] = useState(false);

  const servers = useMemo(
    () => Array.from(new Set(sites.map((s) => s.server_name).filter(Boolean))) as string[],
    [sites],
  );

  const filtered = useMemo(() => {
    return sites.filter((s) => {
      const matchesSearch =
        s.site.toLowerCase().includes(search.toLowerCase()) ||
        (s.url || "").toLowerCase().includes(search.toLowerCase());
      const matchesServer = serverFilter === "all" || s.server_name === serverFilter;
      const matchesPremium = !premiumOnly || isTruthyFlag(s.premium_hosting);
      return matchesSearch && matchesServer && matchesPremium;
    });
  }, [sites, search, serverFilter, premiumOnly]);

  return (
    <TooltipProvider>
      <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by site or URL"
            className="w-full sm:w-64"
          />
          <Select value={serverFilter} onValueChange={setServerFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Server" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All servers</SelectItem>
              {servers.map((server) => (
                <SelectItem key={server} value={server}>
                  {server}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant={premiumOnly ? "default" : "outline"}
            onClick={() => setPremiumOnly((p) => !p)}
            className="sm:w-auto"
          >
            Premium only
          </Button>
        </div>
      </div>

        <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
              <TableHead>
                <div className="flex items-center gap-2">
                  <GlobeAltIcon className="h-4 w-4 text-primary" />
                  <span>Site</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-primary" />
                  <span>URL</span>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <ServerStackIcon className="h-4 w-4 text-primary" />
                  <span>Server</span>
                </div>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="h-4 w-4 text-primary" />
                  <span>Premium</span>
                </div>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <CloudIcon className="h-4 w-4 text-primary" />
                  <span>Cloudflare</span>
                </div>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <div className="flex items-center gap-2">
                  <EnvelopeOpenIcon className="h-4 w-4 text-primary" />
                  <span>DMARC</span>
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <EyeIcon className="h-4 w-4 text-primary" />
                  <span>Actions</span>
                </div>
              </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((site) => {
                const serverClass = getServerBadgeClasses(site.server_name || undefined);
                const premium = isTruthyFlag(site.premium_hosting);
                const cloudflare = isTruthyFlag(site.cloudflare);
                const checkup = isTruthyFlag(site.checkup_done);
                const dmarc =
                  site.dmarc_policy && site.dmarc_policy.length > 0 ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Badge className="bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-100">
                          DMARC
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>{site.dmarc_policy}</TooltipContent>
                    </Tooltip>
                  ) : (
                    <Badge variant="outline">No DMARC</Badge>
                  );

                return (
                  <TableRow key={site.id}>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{site.site}</span>
                        {checkup && (
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Checkup</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="truncate max-w-[180px]">
                      {site.url ? (
                        <a className="text-primary hover:underline" href={`https://${site.url}`} target="_blank">
                          {site.url}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("border", serverClass)}>{site.server_name || "—"}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {premium ? (
                        <Badge className="bg-primary/10 text-primary border-primary/30">Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {cloudflare ? (
                        <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Yes</Badge>
                      ) : (
                        <Badge variant="outline">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{dmarc}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => onView(site)}>
                          <EyeIcon className="mr-1 h-4 w-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onEdit(site)}>
                          <PencilSquareIcon className="mr-1 h-4 w-4" />
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    No sites found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </TooltipProvider>
  );
}

