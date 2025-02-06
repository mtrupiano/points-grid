import { createClient } from "@/app/utils/supabase/server";

export default async function getGrid(id: string) {
  const supabase = await createClient();
  return await supabase.from("grids").select().eq("id", id);
}
