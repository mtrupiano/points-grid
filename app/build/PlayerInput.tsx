import { ChangeEvent } from "react";
import TailwindInput from "@/app/components/TailwindInput";
import TailwindButton from "@/app/components/TailwindButton";

export default function PlayerInput({
  playerName,
  handleChangePlayerName,
  numSquares,
  handleChangeNumSquares,
  handleRemovePlayer,
}: {
  playerName: string;
  handleChangePlayerName: (newPlayerName: string) => void;
  numSquares: number;
  handleChangeNumSquares: (newNumSquares: number) => void;
  handleRemovePlayer: () => void;
}) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "player-name") {
      handleChangePlayerName(e.target.value);
    } else if (e.target.name === "num-squares") {
      if (!e?.target?.value) {
        handleChangeNumSquares(0);
      } else {
        handleChangeNumSquares(parseInt(e.target.value));
      }
    }
  };

  return (
    <div className="flex space-x-2 w-96">
      <TailwindInput
        name="player-name"
        value={playerName}
        onChange={handleChange}
      />
      <TailwindInput
        name="num-squares"
        value={numSquares}
        onChange={handleChange}
        type="number"
      />
      <TailwindButton
        className="bg-red-600 hover:bg-red-500 focus:bg-red-500 active:bg-red-500"
        onClick={handleRemovePlayer}
      >
        Remove
      </TailwindButton>
    </div>
  );
}
