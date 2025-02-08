"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams } from "next/navigation";
import PlayerInput from "./PlayerInput";
import { saveGrid } from "./actions/saveGrid";
import calculateGrid from "@/app/lib/calculateGrid";
import { playerStateVar } from "@/app/lib/types";
import TailwindButton from "@/app/components/TailwindButton";
import TailwindInput from "../components/TailwindInput";

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

  const handlePaste = (event: ClipboardEvent) => {
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

  useEffect(() => {
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <div>
      <div className="flex space-x-2 m-2">
        <div className="w-full max-w-sm min-w-[200px]">
          <TailwindInput
            value={homeTeam}
            placeholder="Home"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setHomeTeam(e.target.value)
            }
          />
        </div>
        <div className="flex justify-center items-center"> vs. </div>
        <div className="w-full max-w-sm min-w-[200px]">
          <TailwindInput
            value={awayTeam}
            placeholder="Away"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAwayTeam(e.target.value)
            }
          />
        </div>
      </div>
      <div className="m-2">
        Squares claimed:{" "}
        <span className="font-bold">{getTotalSquares(players)}</span>
        {" / 100"}
        <TailwindButton onClick={handleDistributeEqually} type="button">
          Distribute Equally
        </TailwindButton>
      </div>
      <div className="space-y-2 m-2" id="player-input-container">
        {players.map((player, idx) => (
          <PlayerInput
            key={idx}
            playerName={players[idx].name}
            numSquares={players[idx].numSquares}
            handleChangeNumSquares={handleChangeNumSquares(idx)}
            handleChangePlayerName={handleChangePlayerName(idx)}
          />
        ))}
      </div>
      <div className="space-x-2 flex my-2">
        <TailwindButton onClick={handleAddPlayer}>Add Player</TailwindButton>
        <TailwindButton
          onClick={handleGenerate}
          disabled={getTotalSquares(players) !== 100}
        >
          Generate Grid
        </TailwindButton>
        <a
          href={`/grid/${savedGridId}`}
          className={
            "rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all duration-150 shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2" +
            (!savedGridId
              ? "pointer-events-none cursor-default opacity-50 shadow-none hover:shadow-none hover:bg-slate-800"
              : "")
          }
        >
          View your grid here
        </a>
      </div>
    </div>
  );
}
