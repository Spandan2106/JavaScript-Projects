#!/usr/bin/env node
const crypto = require('crypto');
const fs = require('fs');
const [input, algo = 'sha256'] = process.argv.slice(2);
if (!input) {
  console.error('Usage: node cli-hash.js <file-path-or-text> [algorithm: sha256|md5|sha512]');
  process.exit(1);
}
try {
  const hash = crypto.createHash(algo);
  let sourceType = 'String';

  if (fs.existsSync(input) && fs.statSync(input).isFile()) {
    const fileBuffer = fs.readFileSync(input);
    hash.update(fileBuffer);
    sourceType = `File (${input})`;
  } else {
    hash.update(input);
  }
  console.log(`Source    : ${sourceType}`);
  console.log(`Algorithm : ${algo.toUpperCase()}`);
  console.log(`Hash      : ${hash.digest('hex')}`);
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
