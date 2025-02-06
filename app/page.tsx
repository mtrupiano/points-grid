"use client";

import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [numPlayers, setNumPlayers] = useState(2);
  const handleChange = (e: Event) => {
    if (numPlayers === 0) {
      setNumPlayers(parseInt(e.target.value));
    }
    if (e.target.value === "") {
      setNumPlayers(0);
    } else {
      setNumPlayers(parseInt(e.target.value));
    }
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="flex flex-col justify-center align-middle">
        <span className="text-[48px]">How many players?</span>

        <div className="flex align-middle justify-center space-x-1">
          <button
            className="text-[24px] p-4 rounded-full hover:bg-slate-200 transition duration-150"
            onClick={() => setNumPlayers(numPlayers - 1)}
          >
            -
          </button>

          <input
            className="w-16 focus:outline-none  focus:bg-slate-100 hover:bg-slate-200 transition duration-150 rounded-md [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            type="number"
            value={numPlayers}
            onChange={handleChange}
          />

          <button
            className="text-[24px] p-4 rounded-full hover:bg-slate-200 transition duration-150 focus:ring-2 focus:ring-slate-100"
            onClick={() => setNumPlayers(numPlayers + 1)}
          >
            +
          </button>
        </div>
        <div className="w-full flex justify-center">
          <Link href={`/build?num-players=${numPlayers}`}>
            <button className="hover:bg-slate-200 transition duration-150 w-12 rounded-md p-2 hover:ring-2 hover:ring-slate-200 focus:ring-2 focus:ring-slate-100 active:ring-2 active:ring-slate-100">
              Go
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
