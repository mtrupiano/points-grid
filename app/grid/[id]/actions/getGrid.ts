import { createClient } from "@/app/utils/supabase/server";

export default async function getGrid(id: string) {
  const supabase = await createClient();
  if (!supabase) {
    throw new Error("Could not connect to supabase client");
  }
  return await supabase.from("grids").select().eq("id", id);
}
