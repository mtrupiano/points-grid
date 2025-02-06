import calculateGrid from "../lib/calculateGrid";
export default function generateGrid(
  canvas: HTMLCanvasElement,
  players: [{ name: string; numSquares: number }],
  homeTeam: string = "Home",
  awayTeam: string = "Away",
) {
  const squareSize = 100;
  const overallSize = 10 * squareSize;
  const offset = 100;
  canvas.width = overallSize + 2 * offset;
  canvas.height = overallSize + 2 * offset;

  const context = canvas.getContext("2d");
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#fff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#000";

    context.beginPath();
    context.lineWidth = 3;

    for (let i = offset; i <= overallSize + offset; i += squareSize) {
      context.moveTo(i, offset);
      context.lineTo(i, overallSize + offset);
    }

    for (let i = offset; i <= overallSize + offset; i += squareSize) {
      context.moveTo(offset, i);
      context.lineTo(overallSize + offset, i);
    }

    context.strokeStyle = "black";
    context.stroke();
    context.closePath();

    context.font = "32px Arial";
    context.textAlign = "center";
    context.textBaseline = "middle";

    context.fillText(homeTeam, canvas.width / 2, offset / 4);
    context.rotate(-Math.PI / 2);
    context.fillText(awayTeam, -canvas.width / 2, offset / 4);
    context.rotate(Math.PI / 2);

    context.font = "24px Arial";

    for (let i = 0; i < 10; i++) {
      context.fillText(
        i,
        squareSize / 2 + offset + i * squareSize,
        (3 * offset) / 4,
      );
      context.fillText(
        i,
        (3 * offset) / 4,
        offset + squareSize / 2 + i * squareSize,
      );
    }

    const grid = calculateGrid(players);
    context.font = "12px Arial";
    let x = offset + squareSize / 2;
    let y = offset + squareSize / 2;
    for (let i = 0; i < 10; i++) {
      x = offset + squareSize / 2;
      for (let j = 0; j < 10; j++) {
        context.fillText(grid[i * 10 + j], x, y);
        x += squareSize;
      }
      y += squareSize;
    }
  }
}
