"use client";
import { useState, useRef } from "react";
import html2canvas from "html2canvas";
import { GridData } from "../lib/types";

export default function Grid({
  gridData,
  gridDbId,
}: {
  gridData: GridData;
  gridDbId: string;
}) {
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [hoveredCol, setHoveredCol] = useState<number | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const { homeTeam, awayTeam, grid, players } = gridData;
  const gridContainerRef = useRef(null);

  const handleSelectPlayer = (playerName: string) => {
    if (selectedPlayer === playerName) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(playerName);
    }
  };

  const handleDownloadImage = async () => {
    const element = gridContainerRef?.current;
    if (element) {
      const canvas = await html2canvas(element);
      const dataURL = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "grid.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-2 flex space-x-4">
      <div ref={gridContainerRef}>
        <div className="flex mx-2">
          <div className="text-4xl transform -rotate-90 flex justify-center items-center w-16">
            {awayTeam}
          </div>
          <div>
            <div className="flex justify-center text-4xl h-12">{homeTeam}</div>
            <div className="flex border border-slate-500">
              <div className="w-8 border-x border-slate-500"></div>
              {new Array(10).fill(0).map((e, colIdx) => (
                <div
                  key={`column-${colIdx}`}
                  className={`${
                    hoveredCol === colIdx ? "bg-yellow-100" : ""
                  } border-x border-slate-500 flex justify-center`}
                >
                  <div className="text-2xl w-24 mx-1 flex justify-center">
                    {colIdx}
                  </div>
                </div>
              ))}
            </div>

            {grid.map((row, rowIdx) => (
              <div
                key={`row-${rowIdx}`}
                className="flex border border-slate-500"
              >
                <div
                  className={`${
                    hoveredRow === rowIdx ? "bg-yellow-100" : ""
                  } flex items-center justify-center text-2xl w-8 border-x border-slate-500`}
                >
                  {rowIdx}
                </div>
                {row.map((player, colIdx) => (
                  <div
                    key={`player-${rowIdx}-${colIdx}`}
                    className="border-x border-slate-500"
                  >
                    <div
                      className={`
                    ${hoveredPlayer === player ? "bg-slate-100" : ""} 
                    ${selectedPlayer === player ? "bg-yellow-200" : ""}
                    transition 
                    duration-150 
                    h-24 
                    w-24 
                    rounded-md 
                    flex 
                    justify-center
                    cursor-pointer
                    items-center
                    m-1
                  `}
                      onMouseEnter={() => {
                        setHoveredPlayer(player);
                        setHoveredRow(rowIdx);
                        setHoveredCol(colIdx);
                      }}
                      onMouseLeave={() => {
                        setHoveredPlayer(null);
                        setHoveredRow(null);
                        setHoveredCol(null);
                      }}
                      onClick={() => handleSelectPlayer(player)}
                    >
                      <p>{player}</p>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center py-2 mb-4">
          <a href={`https://points-grid.vercel.app/grid/${gridDbId}`}>
            {`https://points-grid.vercel.app/grid/${gridDbId}`}
          </a>
        </div>
      </div>

      <div>
        <div className="h-12"></div>
        <div className="flex flex-col space-y-1">
          {players.map((player, idx) => (
            <div
              key={`player-list-${idx}`}
              className={`${
                selectedPlayer === player.name ? "bg-yellow-200" : ""
              } py-1 px-3 rounded-md hover:bg-slate-100 transition duration-150 cursor-pointer`}
              onMouseEnter={() => setHoveredPlayer(player.name)}
              onMouseLeave={() => setHoveredPlayer(null)}
              onClick={() => handleSelectPlayer(player.name)}
            >
              {player.name} ({player.numSquares})
            </div>
          ))}
          <div className="flex justify-center">
            <button
              className="hover:bg-slate-300 transition duration-150 rounded-md w-fit py-1 px-3 text-2xl"
              onClick={handleDownloadImage}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
