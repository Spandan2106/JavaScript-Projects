import crypto from "node:crypto";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const CHAR_SETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}|;:,.<>?",
};

function generatePassword(length = 16, options = { upper: true, lower: true, digits: true, symbols: true }) {
  let pool = "";
  const guaranteed = [];

  for (const [key, chars] of Object.entries(CHAR_SETS)) {
    if (options[key]) {
      pool += chars;
      const idx = crypto.randomInt(0, chars.length);
      guaranteed.push(chars[idx]);
    }
  }

  if (!pool) {
    throw new Error("At least one character set must be enabled.");
  }

  const targetLength = Math.max(length, guaranteed.length);
  const result = [...guaranteed];

  while (result.length < targetLength) {
    const idx = crypto.randomInt(0, pool.length);
    result.push(pool[idx]);
  }

  // Fisher-Yates shuffle using cryptographically strong randomness
  for (let i = result.length - 1; i > 0; i--) {
    const j = crypto.randomInt(0, i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result.join("");
}

function checkStrength(password) {
  const checks = {
    minLength: password.length >= 12,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasDigit: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  let label = "Weak";
  if (score >= 5) label = "Strong";
  else if (score >= 3) label = "Medium";

  return { label, score, checks };
}

async function main() {
  const rl = readline.createInterface({ input, output });

  try {
    console.log("=== CLI Password Generator & Strength Checker ===");
    console.log("1. Generate password");
    console.log("2. Check password strength");

    const choice = (await rl.question("\nChoose an option (1 or 2): ")).trim();

    if (choice === "1") {
      const lenInput = (await rl.question("Password length (default 16): ")).trim();
      const length = lenInput ? Number.parseInt(lenInput, 10) : 16;

      if (Number.isNaN(length) || length < 4 || length > 128) {
        console.log("Please enter a valid number between 4 and 128.");
        return;
      }

      const password = generatePassword(length);
      const strength = checkStrength(password);

      console.log(`\nGenerated Password: ${password}`);
      console.log(`Strength: ${strength.label} (${strength.score}/5)`);
    } else if (choice === "2") {
      const pwd = await rl.question("Enter password to check: ");
      const strength = checkStrength(pwd);

      console.log(`\nStrength: ${strength.label} (${strength.score}/5)`);
      console.log(`- Length >= 12: ${strength.checks.minLength ? "Yes" : "No"}`);
      console.log(`- Uppercase:    ${strength.checks.hasUpper ? "Yes" : "No"}`);
      console.log(`- Lowercase:    ${strength.checks.hasLower ? "Yes" : "No"}`);
      console.log(`- Numbers:      ${strength.checks.hasDigit ? "Yes" : "No"}`);
      console.log(`- Symbols:      ${strength.checks.hasSymbol ? "Yes" : "No"}`);
    } else {
      console.log("Invalid option. Run again and select 1 or 2.");
    }
  } finally {
    rl.close();
  }
}
main();
