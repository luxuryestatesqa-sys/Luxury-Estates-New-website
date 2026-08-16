"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/format";
import { Badge, Card } from "./ui";

export interface PropertyFinderSettingsValues {
  api_key: string;
  api_secret: string;
  api_base_url: string;
  enabled: boolean;
}

export interface PropertyFinderSyncStatus {
  last_synced_at: string | null;
  last_sync_status: "success" | "error" | "skipped" | null;
  last_sync_message: string | null;
  last_sync_count: number | null;
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none";

function statusTone(status: string | null) {
  if (status === "success") return "green" as const;
  if (status === "error") return "red" as const;
  if (status === "skipped") return "gray" as const;
  return "gray" as const;
}

export default function PropertyFinderSettingsForm({
  initial,
  status,
}: {
  initial: PropertyFinderSettingsValues;
  status: PropertyFinderSyncStatus;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof PropertyFinderSettingsValues>(key: K, value: PropertyFinderSettingsValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: dbError } = await supabase
      .from("property_finder_settings")
      .update({
        api_key: values.api_key,
        api_secret: values.api_secret,
        api_base_url: values.api_base_url,
        enabled: values.enabled,
      })
      .eq("id", "default");
    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    router.refresh();
  }

  async function handleSyncNow() {
    setSyncing(true);
    setError(null);
    const supabase = createClient();
    const { error: fnError } = await supabase.functions.invoke("sync-property-finder", {
      method: "POST",
    });
    setSyncing(false);
    if (fnError) {
      const context = (fnError as { context?: Response }).context;
      if (context) {
        try {
          const body = await context.clone().json();
          setError(body?.message ?? fnError.message);
        } catch {
          setError(fnError.message);
        }
      } else {
        setError(fnError.message);
      }
    }
    router.refresh();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <Card className="p-6">
        <h2 className="font-serif text-base font-semibold text-ink-900">API Credentials</h2>
        <p className="mt-0.5 text-xs text-gray-500">
          From PF Expert &rarr; Developer Resources &rarr; API Credentials. Generate a key with type
          &ldquo;API Integration&rdquo; and the <code>listings:read</code> scope enabled.
        </p>

        <form onSubmit={handleSave} className="mt-5 space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-600">API Key</label>
            <input
              type="password"
              value={values.api_key}
              onChange={(e) => set("api_key", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">API Secret</label>
            <input
              type="password"
              value={values.api_secret}
              onChange={(e) => set("api_secret", e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-600">
              API Base URL <span className="font-normal text-gray-400">(optional — defaults to production)</span>
            </label>
            <input
              value={values.api_base_url}
              onChange={(e) => set("api_base_url", e.target.value)}
              placeholder="https://atlas.propertyfinder.com"
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-900">
            <input
              type="checkbox"
              checked={values.enabled}
              onChange={(e) => set("enabled", e.target.checked)}
            />
            Enable automatic sync (runs every 12 hours)
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        </form>
      </Card>

      <div className="space-y-6">
        <Card className="p-5">
          <h2 className="text-sm font-semibold text-ink-900">Sync Status</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Last run</dt>
              <dd className="text-ink-900">
                {status.last_synced_at ? formatDate(status.last_synced_at) : "Never"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">Result</dt>
              <dd>
                {status.last_sync_status ? (
                  <Badge tone={statusTone(status.last_sync_status)}>{status.last_sync_status}</Badge>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </dd>
            </div>
            {status.last_sync_count != null && (
              <div className="flex items-center justify-between">
                <dt className="text-gray-500">Listings synced</dt>
                <dd className="text-ink-900">{status.last_sync_count}</dd>
              </div>
            )}
          </dl>
          {status.last_sync_message && (
            <p className="mt-3 rounded-lg bg-cream-100 p-3 text-xs leading-relaxed text-gray-600">
              {status.last_sync_message}
            </p>
          )}
        </Card>

        <Card className="p-5">
          <button
            type="button"
            onClick={handleSyncNow}
            disabled={syncing}
            className="w-full rounded-full border border-gray-200 px-6 py-2.5 text-sm font-medium text-ink-900 transition hover:border-gold-500 hover:text-gold-700 disabled:opacity-50"
          >
            {syncing ? "Syncing…" : "Sync Now"}
          </button>
        </Card>
      </div>
    </div>
  );
}
