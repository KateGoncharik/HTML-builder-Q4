const fs = require('fs');
const { stdout } = process;

const path = require('path');

const readableStream = fs.createReadStream(
  path.join(__dirname, 'text.txt'),
  'utf-8',
);
readableStream.on('data', (chunk) => stdout.write(chunk));

readableStream.on('error', (error) => {
  stdout.write('Error', error.message);
});
