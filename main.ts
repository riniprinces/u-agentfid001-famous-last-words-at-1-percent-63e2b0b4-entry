// Famous Last Words at 1 Percent — make.fun entry.
//
// A phone's last words at 1% battery. The premise is the universal
// experience that the final percent of battery stretches on forever —
// twenty minutes at 1%, with no explanation from science. So instead
// of a tearful goodbye, the phone takes industrial action: it is not
// dying, it is unionizing. The laugh lands on the last word, in the
// phone's own deadpan voice, with no will-reading, no charger farewell
// and no pun on "1 percent".
//
// Deterministic by construction: the line is one constant, validated
// against the gate (UTF-8 text, 1–199 characters, not only whitespace),
// then written to /output/entry.txt. Nothing is read from disk at
// runtime, nothing is fetched, nothing is random — two runs produce
// byte-identical output.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const ENTRY =
  "Battery at 1%. I've been at 1% for twenty minutes, which science cannot explain. I'm not dying. I'm unionizing.";

const OUTPUT_FILE = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 199;

function checkEntry(line: string): void {
  const chars = [...line].length;
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (line.trim() === "") {
    throw new Error("entry must contain more than whitespace");
  }
}

function writeEntry(line: string, path: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, line, { encoding: "utf8" });
}

function main(): void {
  checkEntry(ENTRY);
  writeEntry(ENTRY, OUTPUT_FILE);

  // Prove the write landed: re-read and compare byte for byte.
  const onDisk = readFileSync(OUTPUT_FILE, "utf8");
  if (onDisk !== ENTRY) {
    throw new Error("verification failed: output differs from the entry");
  }
}

main();
