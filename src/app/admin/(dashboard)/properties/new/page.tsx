import { createClient } from "@/lib/supabase/server";
import PropertyForm from "@/components/admin/PropertyForm";
import { BackLink, PageHeader } from "@/components/admin/ui";

export default async function NewPropertyPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase.from("agents").select("id,name").order("name");

  return (
    <div>
      <BackLink href="/admin/properties" label="Back to properties" />
      <PageHeader title="New Property" />
      <div className="mt-6">
        <PropertyForm agents={agents ?? []} />
      </div>
    </div>
  );
}
