import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

function sortKeysDeep(value) {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === "object") {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortKeysDeep(value[key]);
    }
    return sorted;
  }
  return value;
}

function parseArgs(argv) {
  const args = argv.slice(2);
  let filePath = null;
  let outputPath = null;
  let spaces = 2;
  let sortKeys = false;
  let validateOnly = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--out" || arg === "-o") {
      outputPath = args[++i] ?? null;
    } else if (arg === "--indent" || arg === "-i") {
      const parsed = Number.parseInt(args[++i], 10);
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 8) {
        spaces = parsed;
      }
    } else if (arg === "--sort") {
      sortKeys = true;
    } else if (arg === "--validate") {
      validateOnly = true;
    } else if (!arg.startsWith("-") && !filePath) {
      filePath = arg;
    }
  }

  return { filePath, outputPath, spaces, sortKeys, validateOnly };
}

async function main() {
  const { filePath, outputPath, spaces, sortKeys, validateOnly } = parseArgs(process.argv);

  if (!filePath) {
    console.log("Usage: node cli-json.js <file.json> [--out <output.json>] [--indent <0-8>] [--sort] [--validate]");
    process.exitCode = 1;
    return;
  }

  const resolvedInput = path.resolve(filePath);
  try {
    const raw = await fs.readFile(resolvedInput, "utf8");
    let parsed = JSON.parse(raw);

    if (sortKeys) {
      parsed = sortKeysDeep(parsed);
    }
    if (validateOnly) {
      console.log(`Valid JSON: ${resolvedInput}`);
      return;
    }
    const formatted = `${JSON.stringify(parsed, null, spaces)}\n`;
    if (outputPath) {
      const resolvedOutput = path.resolve(outputPath);
      await fs.writeFile(resolvedOutput, formatted, "utf8");
      console.log(`Formatted JSON written to: ${resolvedOutput}`);
    } else {
      process.stdout.write(formatted);
    }
  } catch (err) {
    if (err instanceof SyntaxError) {
      console.error(`Invalid JSON in ${resolvedInput}: ${err.message}`);
    } else if (err.code === "ENOENT") {
      console.error(`File not found: ${resolvedInput}`);
    } else {
      console.error(`Error processing JSON: ${err.message}`);
    }
    process.exitCode = 1;
  }
}
main();
