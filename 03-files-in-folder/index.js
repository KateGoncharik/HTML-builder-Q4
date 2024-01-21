const fs = require('fs');
const path = require('path');
const { stdout } = require('process');
const secretFolderPath = path.join(__dirname,'secret-folder')

fs.readdir(secretFolderPath, { withFileTypes: true }, (err, files) => {
  if (err){
    stdout.write(err)
    process.exit(1)
  }
  else {
    stdout.write("\nFilename, extension and size for files in secret folder:");

    files.forEach(file => {
        if (file.isDirectory()) {
            return;
        }
        fs.stat(path.join(secretFolderPath, file.name), (err,stats)=>{
            if(err){
                stdout.write(err)
                process.exit(1);
            }
            const name = (path.parse(file.name)).name;
            stdout.write(`${name} - ${(path.extname(file.name)).slice(1)} - ${stats.size} \n`)
        })
    })
  }
})