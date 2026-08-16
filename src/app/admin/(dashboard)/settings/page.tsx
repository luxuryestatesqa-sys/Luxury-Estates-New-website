import { createClient } from "@/lib/supabase/server";
import PropertyFinderSettingsForm from "@/components/admin/PropertyFinderSettingsForm";
import { PageHeader } from "@/components/admin/ui";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("property_finder_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  return (
    <div>
      <PageHeader
        title="Integrations"
        description="Connect external listing feeds. Property Finder listings sync in automatically every 12 hours."
      />
      <div className="mt-6">
        <PropertyFinderSettingsForm
          initial={{
            api_key: settings?.api_key ?? "",
            api_secret: settings?.api_secret ?? "",
            api_base_url: settings?.api_base_url ?? "",
            enabled: settings?.enabled ?? false,
          }}
          status={{
            last_synced_at: settings?.last_synced_at ?? null,
            last_sync_status: settings?.last_sync_status ?? null,
            last_sync_message: settings?.last_sync_message ?? null,
            last_sync_count: settings?.last_sync_count ?? null,
          }}
        />
      </div>
    </div>
  );
}
