import "./style.css";
import { usTop12 } from "./sampleMaps";
import convexHull from "./convexHull";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <canvas></canvas>
  </div>
`;

const points: number[][] = usTop12.map((e) => [e[0], e[1] * -1]); // fliping y axis since the data is weird

const padding = 1;
const height =
  Math.abs(Math.min(...points.map((p) => p[1]))) +
  Math.max(...points.map((p) => p[1])) +
  padding * 2;
const width =
  Math.abs(Math.min(...points.map((p) => p[0]))) +
  Math.max(...points.map((p) => p[0])) +
  padding * 2;
const offsetY = Math.min(...points.map((p) => p[1])) - padding;
const offsetX = Math.min(...points.map((p) => p[0])) - padding;

const canvas = document.querySelector("canvas")!;
const ctx = canvas.getContext("2d")!;

canvas.height = 500;
canvas.width = 1000;

ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);
const scaleX = canvas.width / width;
const scaleY = canvas.height / height;
// const scaleX = Math.min(canvas.width / width, canvas.height / height); // keep aspect ratio
// const scaleY = scaleX;

const plotPoints = (points: number[][]) => {
  points.forEach(([x, y]) => {
    const hue = Math.round((x / width) * 360);
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;

    const dotX = 0.5;
    const dotY = 0.5;

    ctx.beginPath();
    ctx.ellipse(
      (x - offsetX) * scaleX,
      (y - offsetY) * scaleY,
      dotX * scaleY,
      dotY * scaleX,
      0,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
  });
};

const plotPath = (
  path: number[][],
  color: string,
  offsetX2: number,
  offsetY2: number
) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(
    (path[0][0] - offsetX) * scaleX + offsetX2,
    (path[0][1] - offsetY) * scaleY + offsetY2
  );
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(
      (path[i][0] - offsetX) * scaleX + offsetX2,
      (path[i][1] - offsetY) * scaleY + offsetY2
    );
  }
  ctx.stroke();
};

const calculateDistance = (path: number[][]): number => {
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i][0] - path[i + 1][0];
    const dy = path[i][1] - path[i + 1][1];
    distance += Math.sqrt(dx * dx + dy * dy);
  }
  return distance;
};

const calculateRoughDistance = (path: number[][]): number => {
  let distance = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i][0] - path[i + 1][0];
    const dy = path[i][1] - path[i + 1][1];
    distance += Math.abs(dx) + Math.abs(dy);
  }
  return distance;
};

plotPoints(points);
const path = await convexHull(points);
plotPath(path, "white", 0, 0);
console.log("distance", calculateDistance(path));
console.log("rough distance", calculateRoughDistance(path));
