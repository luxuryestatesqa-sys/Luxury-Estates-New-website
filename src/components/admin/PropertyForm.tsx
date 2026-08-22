"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageListField from "./ImageListField";
import MapLinkField from "./MapLinkField";
import MarkdownField from "./MarkdownField";
import { Card, FormSection } from "./ui";

const PROPERTY_TYPES = ["Apartment", "Villa", "Penthouse", "Townhouse", "Office", "Land"];

export interface PropertyFormValues {
  id?: string;
  slug: string;
  title: string;
  status: "buy" | "rent";
  type: string;
  featured: boolean;
  area: string;
  city: string;
  price: number;
  price_unit: "total" | "month";
  beds: number;
  baths: number;
  size: number;
  year_built: number;
  lat: number | null;
  lng: number | null;
  description: string;
  amenities: string[];
  images: string[];
  agent_id: string | null;
  reference: string;
}

const EMPTY: PropertyFormValues = {
  slug: "",
  title: "",
  status: "buy",
  type: "Apartment",
  featured: false,
  area: "",
  city: "",
  price: 0,
  price_unit: "total",
  beds: 0,
  baths: 0,
  size: 0,
  year_built: 0,
  lat: null,
  lng: null,
  description: "",
  amenities: [],
  images: [],
  agent_id: null,
  reference: "",
};

export default function PropertyForm({
  initial,
  agents,
}: {
  initial?: PropertyFormValues;
  agents: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<PropertyFormValues>(initial ?? EMPTY);
  const [amenitiesText, setAmenitiesText] = useState((initial?.amenities ?? []).join("\n"));
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(initial?.id);

  function set<K extends keyof PropertyFormValues>(key: K, value: PropertyFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...values,
      amenities: amenitiesText.split("\n").map((s) => s.trim()).filter(Boolean),
      agent_id: values.agent_id || null,
    };
    delete (payload as { id?: string }).id;

    const supabase = createClient();
    const { error: dbError } = isEditing
      ? await supabase.from("properties").update(payload).eq("id", initial!.id)
      : await supabase.from("properties").insert(payload);

    setSaving(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateProperties();
    router.push("/admin/properties");
    router.refresh();
  }

  async function handleDelete() {
    if (!initial?.id) return;
    if (!confirm(`Delete "${values.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    const supabase = createClient();
    const { error: dbError } = await supabase.from("properties").delete().eq("id", initial.id);
    setDeleting(false);
    if (dbError) {
      setError(dbError.message);
      return;
    }
    await revalidateProperties();
    router.push("/admin/properties");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Title">
              <input required value={values.title} onChange={(e) => set("title", e.target.value)} className={inputClass} />
            </Field>
            <Field label="Slug (URL)">
              <input required value={values.slug} onChange={(e) => set("slug", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Status">
              <select value={values.status} onChange={(e) => set("status", e.target.value as "buy" | "rent")} className={inputClass}>
                <option value="buy">Buy</option>
                <option value="rent">Rent</option>
              </select>
            </Field>
            <Field label="Type">
              <select value={values.type} onChange={(e) => set("type", e.target.value)} className={inputClass}>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Reference">
              <input required value={values.reference} onChange={(e) => set("reference", e.target.value)} className={inputClass} />
            </Field>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Area">
              <input required value={values.area} onChange={(e) => set("area", e.target.value)} className={inputClass} />
            </Field>
            <Field label="City">
              <input required value={values.city} onChange={(e) => set("city", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Pricing & Specifications">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Price (QAR)">
              <input type="number" required value={values.price} onChange={(e) => set("price", Number(e.target.value))} className={inputClass} />
            </Field>
            <Field label="Price Unit">
              <select value={values.price_unit} onChange={(e) => set("price_unit", e.target.value as "total" | "month")} className={inputClass}>
                <option value="total">Total</option>
                <option value="month">Per Month</option>
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Field label="Beds">
              <input type="number" value={values.beds} onChange={(e) => set("beds", Number(e.target.value))} className={inputClass} />
            </Field>
            <Field label="Baths">
              <input type="number" value={values.baths} onChange={(e) => set("baths", Number(e.target.value))} className={inputClass} />
            </Field>
            <Field label="Size (sqm)">
              <input type="number" value={values.size} onChange={(e) => set("size", Number(e.target.value))} className={inputClass} />
            </Field>
            <Field label="Year Built">
              <input type="number" value={values.year_built} onChange={(e) => set("year_built", Number(e.target.value))} className={inputClass} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Location" description="Used to place the pin on the map.">
          <MapLinkField
            onResolved={(lat, lng) => {
              set("lat", lat);
              set("lng", lng);
            }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Latitude">
              <input type="number" step="any" value={values.lat ?? ""} onChange={(e) => set("lat", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
            </Field>
            <Field label="Longitude">
              <input type="number" step="any" value={values.lng ?? ""} onChange={(e) => set("lng", e.target.value ? Number(e.target.value) : null)} className={inputClass} />
            </Field>
          </div>
        </FormSection>

        <FormSection title="Description & Amenities">
          <MarkdownField label="Description" value={values.description} onChange={(v) => set("description", v)} rows={6} />
          <Field label="Amenities (one per line)">
            <textarea rows={5} value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} className={inputClass} />
          </Field>
        </FormSection>

        <FormSection title="Images">
          <ImageListField label="" value={values.images} onChange={(v) => set("images", v)} />
        </FormSection>
      </div>

      <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
        <Card className="p-5">
          <Field label="Agent">
            <select value={values.agent_id ?? ""} onChange={(e) => set("agent_id", e.target.value || null)} className={inputClass}>
              <option value="">— None —</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </Field>
          <label className="mt-4 flex items-center gap-2 text-sm text-ink-900">
            <input type="checkbox" checked={values.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured on homepage
          </label>
        </Card>

        {error && (
          <Card className="border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-600">{error}</p>
          </Card>
        )}

        <Card className="p-5">
          <button type="submit" disabled={saving} className="w-full rounded-full bg-ink-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gold-500 hover:text-ink-950 disabled:opacity-50">
            {saving ? "Saving…" : isEditing ? "Save Changes" : "Create Property"}
          </button>
          {isEditing && (
            <button type="button" onClick={handleDelete} disabled={deleting} className="mt-2 w-full rounded-full border border-red-200 px-6 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50">
              {deleting ? "Deleting…" : "Delete Property"}
            </button>
          )}
        </Card>
      </div>
    </form>
  );
}

async function revalidateProperties() {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag: "properties" }),
  }).catch(() => {});
}

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-ink-900 focus:border-gold-500 focus:outline-none";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      {label && <label className="text-xs font-medium text-gray-600">{label}</label>}
      {children}
    </div>
  );
}
