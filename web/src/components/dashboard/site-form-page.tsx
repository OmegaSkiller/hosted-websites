"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon, PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { SiteForm } from "@/components/dashboard/site-form";
import { useToast } from "@/hooks/use-toast";
import { SiteCreateInput } from "@/lib/validation/site";
import { Site } from "@/types/site";

type Props = {
  mode: "create" | "edit";
  site?: Site;
};

export function SiteFormPage({ mode, site }: Props) {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: SiteCreateInput) => {
    setLoading(true);
    try {
      const res = await fetch(mode === "edit" && site ? `/api/sites/${site.id}` : "/api/sites", {
        method: mode === "edit" ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || "Request failed");
      }
      toast({ title: mode === "edit" ? "Site updated" : "Site created" });
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const Icon = mode === "edit" ? PencilSquareIcon : PlusCircleIcon;
  const title = mode === "edit" ? "Edit Site" : "Add Site";

  return (
    <div className="space-y-6 rounded-xl border bg-card/80 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-semibold">
          <Icon className="h-6 w-6 text-primary" />
          {title}
        </h1>
        <Button variant="ghost" onClick={() => router.push("/dashboard")}>
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <SiteForm defaultValues={site || undefined} onSubmit={handleSubmit} submitting={loading} />
    </div>
  );
}
