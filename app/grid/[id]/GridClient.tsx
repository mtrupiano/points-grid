"use client";
import generateGrid from "@/app/lib/drawGrid";
import { useEffect, useRef } from "react";

export default function GridClient({ gridJson }: { gridJson: string }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (gridJson) {
      const canvas = canvasRef.current;
      generateGrid(canvas, JSON.parse(gridJson));
    }
  }, [gridJson]);
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
