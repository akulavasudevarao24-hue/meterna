import { supabase } from "@/integrations/supabase/client";

export type ChatMessageRole = "user" | "ai";

export interface ChatHistoryRow {
  id?: string;
  user_id: string;
  role: ChatMessageRole;
  content: string;
  created_at?: string;
}

export async function saveChatMessage(
  userId: string,
  role: ChatMessageRole,
  content: string
): Promise<void> {
  try {
    // @ts-expect-error chat_history table exists at runtime, not in generated types
    await supabase.from("chat_history").insert({
      user_id: userId,
      role,
      content,
    });
  } catch {
    // Tables may not exist; fail silently
  }
}

export async function loadChatHistory(userId: string): Promise<ChatHistoryRow[]> {
  try {
    // @ts-expect-error chat_history table exists at runtime, not in generated types
    const { data, error } = await supabase
      .from("chat_history")
      .select("role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) return [];
    return (data ?? []) as ChatHistoryRow[];
  } catch {
    return [];
  }
}
