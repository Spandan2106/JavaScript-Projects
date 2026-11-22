const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function showMenu() {
  console.log("\n=== CLI Unit Converter ===");
  console.log("1. Kilometers to Miles");
  console.log("2. Miles to Kilometers");
  console.log("3. Celsius to Fahrenheit");
  console.log("4. Fahrenheit to Celsius");
  console.log("5. Kilograms to Pounds");
  console.log("6. Pounds to Kilograms");
  console.log("7. Exit");
  rl.question("\nChoose an option: ", handleChoice);
}

function convertValue(promptText, converterFn) {
  rl.question(promptText, (input) => {
    const val = Number(input.trim());
    if (Number.isNaN(val)) {
      console.log("Please enter a valid number.");
      return showMenu();
    }
    console.log("Result:", converterFn(val).toFixed(2));
    showMenu();
  });
}

function handleChoice(choice) {
  switch (choice.trim()) {
    case "1":
      convertValue("Enter kilometers: ", (km) => km * 0.621371);
      break;
    case "2":
      convertValue("Enter miles: ", (mi) => mi / 0.621371);
      break;
    case "3":
      convertValue("Enter Celsius: ", (c) => (c * 9) / 5 + 32);
      break;
    case "4":
      convertValue("Enter Fahrenheit: ", (f) => ((f - 32) * 5) / 9);
      break;
    case "5":
      convertValue("Enter kilograms: ", (kg) => kg * 2.20462);
      break;
    case "6":
      convertValue("Enter pounds: ", (lb) => lb / 2.20462);
      break;
    case "7":
      console.log("Goodbye!");
      rl.close();
      break;
    default:
      console.log("Invalid option.");
      showMenu();
  }
}

showMenu();
