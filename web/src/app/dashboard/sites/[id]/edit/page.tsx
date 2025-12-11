import { notFound, redirect } from "next/navigation";
import { SiteFormPage } from "@/components/dashboard/site-form-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Site } from "@/types/site";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditSitePage({ params }: Props) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { id } = await params;

  const { data: site } = await supabase.from("sites").select("*").eq("id", id).single();

  if (!site) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <SiteFormPage mode="edit" site={site as Site} />
      </div>
    </main>
  );
}
