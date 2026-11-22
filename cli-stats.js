import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

async function getFileStats(filePath) {
  const [content, stat] = await Promise.all([
    fs.readFile(filePath, "utf8"),
    fs.stat(filePath),
  ]);

  const lines = content.length === 0 ? 0 : content.split(/\r?\n/).length;
  const trimmed = content.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
  const characters = content.length;

  return {
    lines,
    words,
    characters,
    bytes: stat.size,
  };
}

async function getDirectoryStats(dirPath) {
  let files = 0;
  let directories = 0;
  let totalBytes = 0;

  async function walk(currentDir) {
    const entries = await fs.readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        directories += 1;
        await walk(fullPath);
      } else if (entry.isFile()) {
        files += 1;
        const stat = await fs.stat(fullPath);
        totalBytes += stat.size;
      }
    }
  }

  await walk(dirPath);

  return {
    files,
    directories,
    totalBytes,
  };
}

async function main() {
  const target = process.argv[2];

  if (!target) {
    console.log("Usage: node cli-stats.js <file-or-directory-path>");
    process.exitCode = 1;
    return;
  }

  const resolvedPath = path.resolve(target);

  try {
    const stat = await fs.stat(resolvedPath);

    if (stat.isFile()) {
      const stats = await getFileStats(resolvedPath);
      console.log(`File: ${resolvedPath}`);
      console.log(`- Lines:      ${stats.lines}`);
      console.log(`- Words:      ${stats.words}`);
      console.log(`- Characters: ${stats.characters}`);
      console.log(`- Size:       ${stats.bytes} bytes`);
    } else if (stat.isDirectory()) {
      const stats = await getDirectoryStats(resolvedPath);
      console.log(`Directory: ${resolvedPath}`);
      console.log(`- Files:       ${stats.files}`);
      console.log(`- Directories: ${stats.directories}`);
      console.log(`- Total Size:  ${stats.totalBytes} bytes`);
    } else {
      console.log(`Unsupported entry type at: ${resolvedPath}`);
    }
  } catch (err) {
    if (err.code === "ENOENT") {
      console.error(`Error: Path not found -> ${resolvedPath}`);
    } else {
      console.error(`Error reading path: ${err.message}`);
    }
    process.exitCode = 1;
  }
}

main();
