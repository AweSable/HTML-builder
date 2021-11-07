const fs = require('fs');
const path = require('path');

const fullName = path.join(__dirname, 'text.txt');
const rs = fs.createReadStream(fullName, 'utf-8');
rs.on('readable', () => {
	const text = rs.read();
	if (text) console.log(text);
})
