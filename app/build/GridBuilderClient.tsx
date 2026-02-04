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
  const [saving, setSaving] = useState(false);
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
    setSaving(true);
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
      {saving && (
        <div className="absolute bg-gray-300 opacity-80 h-full w-full">
          <div
            role="status"
            className="flex h-full justify-center items-center"
          >
            <svg
              aria-hidden="true"
              className="inline w-8 h-8 text-neutral-tertiary animate-spin fill-yellow-400"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}
      <div className="flex space-x-2 p-2">
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
