const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const directoryToCopy = path.join(__dirname, 'files')
const directoryToFill = path.join(__dirname, 'files-copy')

fs.promises.rm(directoryToFill, { recursive: true, force: true }).then(()=>{
    stdout.write('cleared\n')
    fs.promises.mkdir(directoryToFill, {recursive:true}).then(()=> {
        stdout.write('Directory created successfully');
        fs.readdir(directoryToCopy, (err,files)=>{
            if(err){
                stdout.write(err)
                process.exit(1)
            }
            else{
                files.forEach((file)=>{
                    fs.copyFile(path.join(directoryToCopy,file), path.join(directoryToFill, file), ()=> {
                        stdout.write('copied')
                    })
                })
            }
            })
    }).catch((err)=>{
        stdout.write(err)
        process.exit(1)
    });
});

