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
  const [selectedSquare, setSelectedSquare] = useState<number[] | null>(null);
  const { homeTeam, awayTeam, grid, players } = gridData;
  const gridContainerRef = useRef(null);

  const handleSelectPlayerFromList = (playerName: string) => {
    setSelectedSquare(null);
    if (selectedPlayer === playerName) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(playerName);
    }
  };

  const handleSelectSquare = (
    rowIdx: number,
    colIdx: number,
    playerName: string,
  ) => {
    if (isSelected(rowIdx, colIdx)) {
      setSelectedSquare(null);
    } else {
      setSelectedSquare([rowIdx, colIdx]);
    }
    if (playerName !== selectedPlayer) {
      setSelectedPlayer(playerName);
    }
  };

  const isSelected = (rowIdx: number, colIdx: number) =>
    selectedSquare &&
    selectedSquare[0] === rowIdx &&
    selectedSquare[1] === colIdx;

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
        <div className="flex">
          <div
            style={{ writingMode: "sideways-lr" }}
            className="flex justify-center text-4xl w-12"
          >
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
                    <button
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
                        group
                        relative
                      `}
                      data-tooltip-target={`tooltip-${rowIdx}-${colIdx}`}
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
                      onClick={() => handleSelectSquare(rowIdx, colIdx, player)}
                    >
                      <p>{player}</p>
                      <div
                        className={`${isSelected(rowIdx, colIdx) ? "opacity-100" : "opacity-0"} group-hover:opacity-100 transition-opacity duration-150 absolute bottom-full mb-1 pointer-events-none`}
                        data-html2canvas-ignore="true"
                      >
                        <div
                          role="tooltip"
                          id={`tooltip-${rowIdx}-${colIdx}`}
                          className="text-sm py-1 px-2 bg-slate-800 text-white rounded-md whitespace-nowrap"
                        >
                          {`${homeTeam} *${colIdx} - ${awayTeam} *${rowIdx}`}
                        </div>
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-800"></div>
                      </div>
                    </button>
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

      <div className="mt-12 flex flex-col space-y-1 items-center">
        {players.map((player, idx) => (
          <div
            key={`player-list-${idx}`}
            className={`${
              selectedPlayer === player.name ? "bg-yellow-200" : ""
            } py-1 px-3 rounded-md hover:bg-slate-100 transition duration-150 cursor-pointer`}
            onMouseEnter={() => setHoveredPlayer(player.name)}
            onMouseLeave={() => setHoveredPlayer(null)}
            onClick={() => handleSelectPlayerFromList(player.name)}
          >
            {player.name} ({player.numSquares})
          </div>
        ))}

        <button
          className="hover:bg-slate-300 transition duration-150 rounded-md w-fit py-1 px-3 text-2xl"
          onClick={handleDownloadImage}
        >
          Save
        </button>
        <button
          className="hover:bg-slate-300 transition duration-150 rounded-md w-fit py-1 px-3 text-2xl"
          onClick={() =>
            navigator.clipboard.writeText(
              `https://points-grid.vercel.app/grid/${gridDbId}`,
            )
          }
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
