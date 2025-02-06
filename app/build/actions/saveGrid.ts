"use server";
import { createClient } from "../../utils/supabase/server";

export async function saveGrid(data: {
  homeTeam: string;
  awayTeam: string;
  grid: string[][];
}) {
  const supabase = await createClient();
  const result = await supabase
    .from("grids")
    .insert({
      json: JSON.stringify(data),
    })
    .select();

  return result;
}
