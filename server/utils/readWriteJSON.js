import fs from "fs";
import path from "path";

export function readJSON(relPath) {
  const abs = path.join(process.cwd(), relPath);
  return JSON.parse(fs.readFileSync(abs, "utf-8"));
}

export function writeJSON(relPath, data) {
  const abs = path.join(process.cwd(), relPath);
  fs.writeFileSync(abs, JSON.stringify(data, null, 2), "utf-8");
}