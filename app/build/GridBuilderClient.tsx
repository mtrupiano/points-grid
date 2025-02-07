"use client";

import { ClipboardEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, TextField } from "@mui/material";
import PlayerInput from "./PlayerInput";
import { saveGrid } from "./actions/saveGrid";
import calculateGrid from "@/app/lib/calculateGrid";
import { playerStateVar } from "@/app/lib/types";

const initPlayersArr = (numPlayers: number): playerStateVar[] => {
  return Array.from({ length: numPlayers }, (_, i) => ({
    name: `Player ${i + 1}`,
    numSquares: Math.floor(100 / numPlayers),
  }));
};

const getTotalSquares = (players: playerStateVar[]) => {
  return players.reduce((prev, cur) => prev + cur.numSquares, 0);
};

export default function GridBuilderClient() {
  const searchParams = useSearchParams();
  let numPlayers = parseInt(searchParams.get("num-players") || "2");
  if (numPlayers > 100) numPlayers = 100;

  const [trueNumPlayers, setTrueNumPlayers] = useState<number>(numPlayers);
  const [players, setPlayers] = useState<playerStateVar[]>(
    initPlayersArr(numPlayers),
  );
  const [homeTeam, setHomeTeam] = useState("Home");
  const [awayTeam, setAwayTeam] = useState("Away");
  const [savedGridId, setSavedGridId] = useState(null);

  const handleChangePlayerName = (idx: number) => (newPlayerName: string) => {
    players[idx].name = newPlayerName;
    setPlayers([...players]);
  };

  const handleChangeNumSquares = (idx: number) => (newNumSquares: number) => {
    players[idx].numSquares = newNumSquares;
    setPlayers([...players]);
  };

  const handleAddPlayer = () => {
    setTrueNumPlayers(trueNumPlayers + 1);
    setPlayers([
      ...players,
      {
        name: `Player ${players.length + 1}`,
        numSquares: 10,
      },
    ]);
  };

  const handleDistributeEqually = () => {
    setPlayers((prev) => {
      return prev.map((e) => ({
        ...e,
        numSquares: Math.floor(100 / trueNumPlayers),
      }));
    });
  };

  const handlePaste = (event: ClipboardEvent<HTMLDivElement>) => {
    // eslint-disable-next-line
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const formatted = clipboardData
      .getData("text")
      .split("\n")
      .map((e: string) => {
        const [name, numSquares] = e.split("\t");
        return {
          name,
          numSquares: parseInt(numSquares),
        };
      });
    setPlayers(formatted);
    setTrueNumPlayers(formatted.length);
  };

  const handleGenerate = async () => {
    const grid = calculateGrid(players);
    const result = await saveGrid({
      homeTeam,
      awayTeam,
      grid,
      players,
    });
    setSavedGridId(result?.data?.[0]?.id);
  };

  return (
    <div>
      <div
        onPaste={handlePaste}
        style={{
          position: "absolute",
          left: "0",
          top: "0",
          width: "100vw",
          height: "100vh",
        }}
      />
      <TextField
        label="Home"
        value={homeTeam}
        onChange={(e) => setHomeTeam(e.target.value)}
      />
      <TextField
        label="Away"
        value={awayTeam}
        onChange={(e) => setAwayTeam(e.target.value)}
      />
      {getTotalSquares(players)}
      <Button onClick={handleDistributeEqually}>Distribute Equally</Button>
      {players.map((player, idx) => (
        <PlayerInput
          key={idx}
          playerName={players[idx].name}
          numSquares={players[idx].numSquares}
          handleChangeNumSquares={handleChangeNumSquares(idx)}
          handleChangePlayerName={handleChangePlayerName(idx)}
        />
      ))}

      <Button onClick={handleAddPlayer}>Add Player</Button>
      <Button
        onClick={handleGenerate}
        disabled={getTotalSquares(players) !== 100}
      >
        Generate
      </Button>
      {savedGridId && (
        <Button href={`/grid/${savedGridId}`}>View your grid here</Button>
      )}
    </div>
  );
}
