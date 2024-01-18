const { stdin, stdout } = process;
stdout.write('Write your name, please\n');

stdin.on('data', (data) => {
  const dataStringified = data.toString();
  const reversed = dataStringified.split('').reverse().join('');
  stdout.write(`It is yours:, ${reversed}`);
  process.exit();
});
