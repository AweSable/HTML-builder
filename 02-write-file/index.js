const fs = require('fs');
const path = require('path');
const readline = require('readline');
//const process = require('process');
const input = process.stdin;
const output = process.stdout;
const fullName = path.join(__dirname, 'text.txt');
const ws = fs.createWriteStream(fullName, 'utf-8');
const rl = readline.createInterface({input, output});

console.log('Enter the text you want to write to the file:');
rl.on('line', (input) => {
	if (input == 'exit'){
		rl.close();
	} else ws.write(input + '\r\n');
})
rl.on('close', () => {
	ws.close();
	console.log('Have a nice day');
})