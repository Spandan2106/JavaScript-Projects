#!/usr/bin/env node
const args = process.argv.slice(2);
const minutes = parseInt(args[0], 10) || 25;
const label = args[1] || 'Focus Session';
if (isNaN(minutes) || minutes <= 0) {
  console.error('Usage: node cli-pomodoro.js [minutes] [label]');
  process.exit(1);
}

let remainingSeconds = minutes * 60;

console.log(`Starting "${label}" for ${minutes} minute(s)... (Press Ctrl+C to stop)\n`);

const formatTime = (secs) => {
  const m = String(Math.floor(secs / 60)).padStart(2, '0');
  const s = String(secs % 60).padStart(2, '0');
  return `${m}:${s}`;
};

const timer = setInterval(() => {
  process.stdout.write(`\r⏳ Remaining: ${formatTime(remainingSeconds)} `);
  remainingSeconds--;

  if (remainingSeconds < 0) {
    clearInterval(timer);
    process.stdout.write('\r✅ Time is up! Take a break.      \n\x07'); // \x07 triggers terminal bell
  }
}, 1000);
