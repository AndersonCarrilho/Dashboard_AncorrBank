import { createClient } from "@supabase/supabase-js";

// For development/testing only
const supabaseUrl = "https://your-project.supabase.co";
const supabaseAnonKey = "your-anon-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
