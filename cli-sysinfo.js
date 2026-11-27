#!/usr/bin/env node
const os = require('os');
const toGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2);
const formatUptime = (seconds) => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hrs}h ${mins}m`;
};
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;
const cpus = os.cpus();
const nets = os.networkInterfaces();
let localIP = 'Unavailable';
for (const name of Object.keys(nets)) {
  for (const net of nets[name]) {
    if (net.family === 'IPv4' && !net.internal) {
      localIP = net.address;
      break;
    }
  }
}
console.log('=== System Information ===');
console.log(`OS Platform : ${os.type()} (${os.release()}) [${os.arch()}]`);
console.log(`Hostname    : ${os.hostname()}`);
console.log(`Uptime      : ${formatUptime(os.uptime())}`);
console.log(`CPU Model   : ${cpus[0].model.trim()} (${cpus.length} cores)`);
console.log(`Memory      : ${toGB(usedMem)} GB / ${toGB(totalMem)} GB used`);
console.log(`Local IP    : ${localIP}`);
