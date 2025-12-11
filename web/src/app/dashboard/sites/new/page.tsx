import { redirect } from "next/navigation";
import { SiteFormPage } from "@/components/dashboard/site-form-page";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function NewSitePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-4 py-10">
      <div className="mx-auto max-w-4xl space-y-6">
        <SiteFormPage mode="create" />
      </div>
    </main>
  );
}
