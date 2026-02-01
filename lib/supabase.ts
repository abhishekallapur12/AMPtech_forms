import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// IMPORTANT: Use environment variables for production.
export const supabaseUrl = "https://wwqbgosqxqeampdgtrtz.supabase.co";
export const supabaseAnonKey = "sb_publishable_6f-o4NnKqYHBciTNjFrm5w_PtL99WBA";

export const sheetBestUrl = "https://api.sheetbest.com/sheets/b8fd5513-0fc6-4d8d-bc10-fcd1f528cf67";

export let supabase: SupabaseClient | null = null;
if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
}
