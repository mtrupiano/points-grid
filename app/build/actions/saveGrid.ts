"use server";
import { playerStateVar } from "@/app/lib/types";
import { createClient } from "@/app/utils/supabase/server";

export async function saveGrid(data: {
  homeTeam: string;
  awayTeam: string;
  grid: string[][];
  players: playerStateVar[];
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
