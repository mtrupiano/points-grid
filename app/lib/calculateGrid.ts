import { playerStateVar } from "../build/types";

export default function calculateGrid(players: playerStateVar[]): string[] {
  const arr = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players[i].numSquares; j++) {
      arr.push(players[i].name);
    }
  }

  const result = [];
  while (arr.length > 0) {
    const pick = Math.floor(Math.random() * arr.length);
    result.push(arr[pick]);
    arr.splice(pick, 1);
  }

  return result;
}
