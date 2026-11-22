const fs = require("fs");
const path = require("path");
const readline = require("readline");
const file = path.join(__dirname, "notes.json");
let notes = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
const save = () => fs.writeFileSync(file, JSON.stringify(notes, null, 2));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function showMenu() {
  console.log("\n=== CLI Note Taker ===");
  console.log("1. View notes");
  console.log("2. Add note");
  console.log("3. Search notes");
  console.log("4. Delete note");
  console.log("5. Exit");
  rl.question("\nChoose an option: ", handleChoice);
}
function handleChoice(choice) {
  switch (choice.trim()) {
    case "1":
      if (notes.length === 0) {
        console.log("No notes saved.");
      } else {
        notes.forEach((n, i) => {
          console.log(`${i + 1}. [${n.date}] ${n.title}: ${n.body}`);
        });
      }
      showMenu();
      break;

    case "2":
      rl.question("Enter note title: ", (title) => {
        if (!title.trim()) {
          console.log("Title cannot be empty.");
          return showMenu();
        }
        rl.question("Enter note content: ", (body) => {
          notes.push({
            title: title.trim(),
            body: body.trim(),
            date: new Date().toISOString().slice(0, 10),
          });
          save();
          console.log("Note saved.");
          showMenu();
        });
      });
      break;

    case "3":
      rl.question("Enter search keyword: ", (keyword) => {
        const q = keyword.trim().toLowerCase();
        const matches = notes.filter(
          (n) => n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q)
        );
        if (matches.length === 0) {
          console.log("No matching notes found.");
        } else {
          matches.forEach((n, i) => {
            console.log(`${i + 1}. [${n.date}] ${n.title}: ${n.body}`);
          });
        }
        showMenu();
      });
      break;

    case "4":
      rl.question("Enter note number to delete: ", (num) => {
        const idx = Number(num) - 1;
        if (notes[idx]) {
          notes.splice(idx, 1);
          save();
          console.log("Note deleted.");
        } else {
          console.log("Invalid note number.");
        }
        showMenu();
      });
      break;

    case "5":
      console.log("Goodbye!");
      rl.close();
      break;

    default:
      console.log("Invalid option.");
      showMenu();
  }
}

showMenu();
