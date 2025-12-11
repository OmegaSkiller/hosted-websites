import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { siteCreateSchema, SiteCreateInput } from "@/lib/validation/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn, isTruthyFlag } from "@/lib/utils";

type Props = {
  defaultValues?: Partial<SiteCreateInput>;
  onSubmit: (values: SiteCreateInput) => Promise<void>;
  submitting: boolean;
};

export function SiteForm({ defaultValues, onSubmit, submitting }: Props) {
  const form = useForm<SiteCreateInput>({
    resolver: zodResolver(siteCreateSchema),
    defaultValues: defaultValues as SiteCreateInput,
  });

  useEffect(() => {
    form.reset(defaultValues as SiteCreateInput);
  }, [defaultValues, form]);

  useEffect(() => {
    const toggleFields: (keyof SiteCreateInput)[] = [
      "premium_hosting",
      "checkup_done",
      "seo_monitoring",
      "cloudflare",
      "dns_access",
      "events_cal",
    ];
    toggleFields.forEach((field) => {
      const value = form.getValues(field);
      if (value === undefined || value === null || value === "") {
        form.setValue(field, "0", { shouldDirty: false });
      } else if (typeof value === "number") {
        form.setValue(field, value === 1 ? "1" : "0", { shouldDirty: false });
      } else {
        const normalized = isTruthyFlag(value) ? "1" : "0";
        form.setValue(field, normalized, { shouldDirty: false });
      }
    });
  }, [form]);

  const toggleFields: { key: keyof SiteCreateInput; label: string }[] = [
    { key: "premium_hosting", label: "Premium Hosting" },
    { key: "checkup_done", label: "Site Checkup" },
    { key: "seo_monitoring", label: "SEO Monitoring" },
    { key: "cloudflare", label: "Cloudflare" },
    { key: "dns_access", label: "DNS Access" },
    { key: "events_cal", label: "Events Calendar" },
  ];

  const toggleButton = (field: keyof SiteCreateInput, label: string) => {
    const isOn = isTruthyFlag(form.watch(field));
    return (
      <button
        type="button"
        onClick={() => form.setValue(field, isOn ? "0" : "1", { shouldDirty: true })}
        className={cn(
          "flex items-center justify-between rounded-lg border px-4 py-3 text-left transition-colors",
          isOn ? "border-primary bg-primary/10 text-primary" : "bg-muted/40 hover:bg-muted/60",
        )}
      >
        <span className="font-medium">{label}</span>
        <span
          className={cn(
            "inline-flex h-6 w-11 items-center rounded-full border p-1 transition-colors",
            isOn ? "border-primary bg-primary/80" : "border-border bg-background",
          )}
        >
          <span
            className={cn(
              "h-4 w-4 rounded-full bg-white shadow transition-transform",
              isOn ? "translate-x-5" : "translate-x-0",
            )}
          />
        </span>
      </button>
    );
  };

  return (
    <form
      className="grid grid-cols-1 gap-4 md:grid-cols-2"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values);
      })}
    >
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="site">Site Name</Label>
        <Input id="site" {...form.register("site")} />
        {form.formState.errors.site && (
          <p className="text-sm text-destructive">{form.formState.errors.site.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" {...form.register("url")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="server_name">Server</Label>
        <Input id="server_name" {...form.register("server_name")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="server_ip">Server IP</Label>
        <Input id="server_ip" {...form.register("server_ip")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input id="username" {...form.register("username")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="db_name">DB Name</Label>
        <Input id="db_name" {...form.register("db_name")} />
      </div>
      {toggleFields.map((field) => (
        <div key={field.key} className="space-y-2">
          <Label>{field.label}</Label>
          {toggleButton(field.key, field.label)}
          <input type="hidden" {...form.register(field.key)} />
        </div>
      ))}
      <div className="space-y-2">
        <Label htmlFor="dmarc_policy">DMARC Policy</Label>
        <Input id="dmarc_policy" {...form.register("dmarc_policy")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="analytics_code">Analytics Code</Label>
        <Input id="analytics_code" {...form.register("analytics_code")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="php_version">PHP Version</Label>
        <Input id="php_version" {...form.register("php_version")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="vc_wbp">VC/WBP</Label>
        <Input id="vc_wbp" {...form.register("vc_wbp")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rev_slider">Rev. Slider</Label>
        <Input id="rev_slider" {...form.register("rev_slider")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="coverage_test">Coverage Test</Label>
        <Input id="coverage_test" {...form.register("coverage_test")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="views_90d">90 Day Views</Label>
        <Input id="views_90d" type="number" {...form.register("views_90d")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="db_url">DB URL</Label>
        <Input id="db_url" {...form.register("db_url")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="site_origin">Site Origin</Label>
        <Input id="site_origin" {...form.register("site_origin")} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="end_client">End Client</Label>
        <Select
          value={(form.watch("end_client") as string) || ""}
          onValueChange={(value) => form.setValue("end_client", value, { shouldDirty: true })}
        >
          <SelectTrigger id="end_client">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {["CodeChameleon", "Custom Systems", "Gearhead", "OLG", "Asher"].map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input type="hidden" {...form.register("end_client")} />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={submitting} className="w-full md:w-auto">
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}

