const fs = require("fs");
const path = require("path");
const readline = require("readline");
const file = path.join(__dirname, "tasks.json");
let tasks = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : [];
const save = () => fs.writeFileSync(file, JSON.stringify(tasks, null, 2));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function showMenu() {
  console.log("\n=== CLI Task Tracker ===");
  console.log("1. View tasks");
  console.log("2. Add task");
  console.log("3. Toggle complete");
  console.log("4. Delete task");
  console.log("5. Exit");
  rl.question("\nChoose an option: ", handleChoice);
}
function handleChoice(choice) {
  switch (choice.trim()) {
    case "1":
      if (tasks.length === 0) {
        console.log("No tasks found.");
      } else {
        tasks.forEach((t, i) => {
          console.log(`${i + 1}. [${t.done ? "x" : " "}] ${t.title}`);
        });
      }
      showMenu();
      break;
    case "2":
      rl.question("Enter task title: ", (title) => {
        if (title.trim()) {
          tasks.push({ title: title.trim(), done: false });
          save();
          console.log("Task added.");
        }
        showMenu();
      });
      break;

    case "3":
      rl.question("Enter task number to toggle: ", (num) => {
        const idx = Number(num) - 1;
        if (tasks[idx]) {
          tasks[idx].done = !tasks[idx].done;
          save();
          console.log("Task updated.");
        } else {
          console.log("Invalid task number.");
        }
        showMenu();
      });
      break;

    case "4":
      rl.question("Enter task number to delete: ", (num) => {
        const idx = Number(num) - 1;
        if (tasks[idx]) {
          tasks.splice(idx, 1);
          save();
          console.log("Task deleted.");
        } else {
          console.log("Invalid task number.");
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
