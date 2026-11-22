const fs = require("fs");
const path = require("path");
const readline = require("readline");
const file = path.join(__dirname, "expenses.json");
let expenses = fs.existsSync(file)
  ? JSON.parse(fs.readFileSync(file, "utf8"))
  : [];
const save = () => fs.writeFileSync(file, JSON.stringify(expenses, null, 2));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
function showMenu() {
  console.log("\n=== CLI Expense Tracker ===");
  console.log("1. View expenses");
  console.log("2. Add expense");
  console.log("3. View total spent");
  console.log("4. Delete expense");
  console.log("5. Exit");
  rl.question("\nChoose an option: ", handleChoice);
}
function handleChoice(choice) {
  switch (choice.trim()) {
    case "1":
      if (expenses.length === 0) {
        console.log("No expenses recorded.");
      } else {
        expenses.forEach((item, i) => {
          console.log(`${i + 1}. ${item.label} - ${item.amount.toFixed(2)}`);
        });
      }
      showMenu();
      break;
    case "2":
      rl.question("Enter expense label: ", (label) => {
        if (!label.trim()) {
          console.log("Label cannot be empty.");
          return showMenu();
        }
        rl.question("Enter amount: ", (amtInput) => {
          const amount = Number(amtInput.trim());
          if (Number.isNaN(amount) || amount <= 0) {
            console.log("Please enter a valid positive number.");
            return showMenu();
          }
          expenses.push({ label: label.trim(), amount });
          save();
          console.log("Expense added.");
          showMenu();
        });
      });
      break;
    case "3": {
      const total = expenses.reduce((sum, item) => sum + item.amount, 0);
      console.log(`Total spent: ${total.toFixed(2)}`);
      showMenu();
      break;
    }
    case "4":
      rl.question("Enter expense number to delete: ", (num) => {
        const idx = Number(num) - 1;
        if (expenses[idx]) {
          expenses.splice(idx, 1);
          save();
          console.log("Expense deleted.");
        } else {
          console.log("Invalid expense number.");
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
