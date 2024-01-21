const fs = require('fs');
const {  stdin,stdout } = process;

const path = require("path");

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
    if (err) throw err;
    stdout.write("File was created \n");
  stdout.write('Type your text \n')

  });

  const writableStream = fs.createWriteStream(    path.join(__dirname, 'text.txt'),
'utf-8'
);
process.on('exit', () => {
  stdout.write('Bye-bye')
})
  stdin.on('data', (data)=>{
    if(data.toString().trim() === 'exit'){
      process.exit();
    } else{
      writableStream.write(data)
    }
  })
  stdin.on('error', (err)=>{throw err})

