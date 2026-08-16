import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { createClient } from "@/lib/supabase/server";

const ALLOWED_TAGS = new Set(["agents", "properties", "off-plan", "blog"]);

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tag } = await request.json().catch(() => ({ tag: null }));
  if (typeof tag !== "string" || !ALLOWED_TAGS.has(tag)) {
    return NextResponse.json({ error: "Invalid tag" }, { status: 400 });
  }

  // { expire: 0 } forces immediate expiration (not stale-while-revalidate)
  // since the admin UI expects to see its own write on the next page load.
  revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true });
}
