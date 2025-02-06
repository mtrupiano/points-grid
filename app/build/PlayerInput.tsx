import { TextField } from "@mui/material";
import { ChangeEvent } from "react";

export default function PlayerInput({
  playerName,
  handleChangePlayerName,
  numSquares,
  handleChangeNumSquares,
}: {
  playerName: string;
  handleChangePlayerName: (newPlayerName: string) => void;
  numSquares: number;
  handleChangeNumSquares: (newNumSquares: number) => void;
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
    <div>
      <TextField
        name="player-name"
        value={playerName}
        onChange={handleChange}
      />
      <TextField
        name="num-squares"
        value={numSquares}
        onChange={handleChange}
        type="number"
      />
    </div>
  );
}
