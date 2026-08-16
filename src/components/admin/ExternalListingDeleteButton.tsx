"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ExternalListingDeleteButton({ id, title }: { id: string; title: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Remove "${title}"? It will reappear on the next sync if it's still in the feed.`)) return;
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("properties").delete().eq("id", id);
    router.push("/admin/properties");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="w-full rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
    >
      {deleting ? "Removing…" : "Remove Listing"}
    </button>
  );
}
