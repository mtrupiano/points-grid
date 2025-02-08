"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import calculateGrid from "@/app/lib/calculateGrid";
import { playerStateVar } from "@/app/lib/types";
import TailwindButton from "@/app/components/TailwindButton";
import TailwindInput from "@/app/components/TailwindInput";
import { saveGrid } from "./actions/saveGrid";
import PlayerInput from "./PlayerInput";

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
  const router = useRouter();

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
        name: "Player",
        numSquares: 10,
      },
    ]);
  };

  const handleRemovePlayer = (idx: number) => {
    setTrueNumPlayers(trueNumPlayers - 1);
    players.splice(idx, 1);
    setPlayers([...players]);
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
    const id = result?.data?.[0]?.id;
    if (id) {
      router.push(`/grid/${id}`);
    }
  };

  useEffect(() => {
    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, []);

  const totalSquares = getTotalSquares(players);

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
        <span
          className={`font-bold rounded-md border-2 p-2 ${
            totalSquares === 100
              ? "text-green-600 border-green-600"
              : "text-red-600 border-red-600"
          }`}
        >
          {totalSquares}
        </span>
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
            handleRemovePlayer={() => handleRemovePlayer(idx)}
          />
        ))}
      </div>
      <div className="space-x-2 flex my-2">
        <TailwindButton onClick={handleAddPlayer}>Add Player</TailwindButton>
        <TailwindButton
          onClick={handleGenerate}
          disabled={totalSquares !== 100}
        >
          Get My Grid
        </TailwindButton>
      </div>
    </div>
  );
}
