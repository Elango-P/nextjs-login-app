import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wktosroqlanmjwbanssy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrdG9zcm9xbGFubWp3YmFuc3N5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNDg3ODIsImV4cCI6MjA3OTYyNDc4Mn0.FlRLoK8RVflxpIDnnVl5u8sCGffAWrXfHO216DX5PPQ";

export const supabase = createClient(supabaseUrl, supabaseKey,{
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    }
  });
