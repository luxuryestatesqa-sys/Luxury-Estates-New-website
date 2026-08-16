import { createClient } from "@/lib/supabase/server";
import PropertiesList from "@/components/admin/PropertiesList";
import { PageHeader, PrimaryButton } from "@/components/admin/ui";

// PostgREST caps a single request at 1000 rows — page through so a synced
// Property Finder inventory past that size doesn't silently vanish from admin.
const PAGE_SIZE = 1000;

export default async function AdminPropertiesPage() {
  const supabase = await createClient();
  const properties = [];
  let from = 0;
  for (;;) {
    const { data } = await supabase
      .from("properties")
      .select("id,title,status,area,city,price,price_unit,featured,images,source")
      .order("created_at", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);
    const page = data ?? [];
    properties.push(...page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return (
    <div>
      <PageHeader
        title="Properties"
        description="Buy and rent listings shown across the site."
        actions={<PrimaryButton href="/admin/properties/new">+ New Property</PrimaryButton>}
      />

      <div className="mt-6">
        <PropertiesList rows={properties} />
      </div>
    </div>
  );
}
