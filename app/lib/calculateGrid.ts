import { playerStateVar } from "../build/types";

export default function calculateGrid(players: playerStateVar[]): string[][] {
  const arr = [];
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < players[i].numSquares; j++) {
      arr.push(players[i].name);
    }
  }

  const temp = [];
  while (arr.length > 0) {
    const pick = Math.floor(Math.random() * arr.length);
    temp.push(arr[pick]);
    arr.splice(pick, 1);
  }

  const result = [];
  for (let i = 0; i < 10; i++) {
    result.push([]);
    for (let j = 0; j < 10; j++) {
      result[i].push(temp[i * 10 + j]);
    }
  }

  return result;
}
