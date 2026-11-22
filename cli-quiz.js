const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const questions = [
  {
    q: "Which method converts a JSON string into a JavaScript object?",
    options: ["1. JSON.stringify()", "2. JSON.parse()", "3. Object.assign()", "4. Array.from()"],
    answer: 2,
  },
  {
    q: "Which keyword declares a block-scoped variable that cannot be reassigned?",
    options: ["1. var", "2. let", "3. const", "4. static"],
    answer: 3,
  },
  {
    q: "What does typeof [] return in JavaScript?",
    options: ["1. 'array'", "2. 'list'", "3. 'object'", "4. 'undefined'"],
    answer: 3,
  },
  {
    q: "Which built-in Node.js module is used to read and write files?",
    options: ["1. fs", "2. http", "3. url", "4. crypto"],
    answer: 1,
  },
];
let index = 0;
let score = 0;
console.log("=== CLI JavaScript Quiz ===\n");
function askQuestion() {
  if (index >= questions.length) {
    console.log(`\nQuiz finished! Your score: ${score}/${questions.length}`);
    return rl.close();
  }
  const current = questions[index];
  console.log(`Q${index + 1}. ${current.q}`);
  current.options.forEach((opt) => console.log(opt));

  rl.question("\nYour answer (1-4): ", (input) => {
    const choice = Number(input.trim());
    if (choice >= 1 && choice <= 4) {
      if (choice === current.answer) {
        console.log("Correct!\n");
        score += 1;
      } else {
        console.log(`Wrong! Correct answer: ${current.answer}\n`);
      }
      index += 1;
    } else {
      console.log("Please enter a number between 1 and 4.\n");
    }
    askQuestion();
  });
}

askQuestion();
