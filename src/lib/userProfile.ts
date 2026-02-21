import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export async function upsertUserProfile(user: User): Promise<void> {
  try {
    // @ts-expect-error user_profiles table exists at runtime, not in generated types
    await supabase.from("user_profiles").upsert(
      {
        id: user.id,
        email: user.email ?? undefined,
        display_name: user.user_metadata?.full_name ?? user.user_metadata?.name ?? undefined,
        avatar_url: user.user_metadata?.avatar_url ?? user.user_metadata?.picture ?? undefined,
        phone: user.phone ?? undefined,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
  } catch {
    // Tables may not exist yet; fail silently for hackathon
  }
}
