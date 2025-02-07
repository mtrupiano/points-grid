"use client";
import { useEffect, useRef } from "react";
import drawGrid from "@/app/lib/drawGrid";

export default function GridClient({ gridJson }: { gridJson: string }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (gridJson) {
      const canvas = canvasRef?.current;
      if (canvas) drawGrid(canvas, JSON.parse(gridJson));
    }
  }, [gridJson]);
  return (
    <div>
      <canvas ref={canvasRef} />
    </div>
  );
}
