const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const target = Math.floor(Math.random() * 100) + 1;
let attempts = 0;
console.log("=== CLI Number Guessing Game ===");
console.log("Guess a number between 1 and 100.\n");
function askGuess() {
  rl.question("Enter your guess: ", (input) => {
    const guess = Number(input.trim());
    if (!Number.isInteger(guess) || guess < 1 || guess > 100) {
      console.log("Please enter a valid whole number between 1 and 100.\n");
      return askGuess();
    }

    attempts += 1;

    if (guess < target) {
      console.log("Too low! Try again.\n");
      askGuess();
    } else if (guess > target) {
      console.log("Too high! Try again.\n");
      askGuess();
    } else {
      console.log(`\nCorrect! You guessed ${target} in ${attempts} attempt(s).`);
      rl.close();
    }
  });
}

askGuess();
