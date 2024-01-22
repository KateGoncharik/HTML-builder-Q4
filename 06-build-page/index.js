const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('process');

const directoryWithStyles = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');


const directoryToCopy = path.join(__dirname, 'assets')
// const projectDist = path.join(__dirname, 'project-dist');
const directoryToFill = path.join(projectDist, 'assets');


function copyAllNestedFiles(sourcePath, destinationPath) {

    fs.readdir(sourcePath,{ withFileTypes: true },  (err,files)=>{
        if (err)  {
            stdout.write(`${err}`)
            process.exit(1)
        }
        files.forEach((file)=>{
            const sourceFilePath = path.join(sourcePath, file.name);
            const destinationFilePath = path.join(destinationPath, file.name);
            if(file.isDirectory()){
                fs.promises.mkdir(path.join(destinationFilePath)).then(()=> {
                    copyAllNestedFiles(sourceFilePath,destinationFilePath)
                })
            } else{
                    fs.copyFile(sourceFilePath, destinationFilePath, (err)=> {
                        if(err )stdout.write(`${err}`)
                    })
            }
        })
    })
}

function bundleStyles(){
    fs.writeFile(projectDist,'style.css', ()=>{stdout.write('Styles bundled successfully')});
    fs.readdir(directoryWithStyles, (err,files)=>{
        if(err){
            stdout.write(err)
            process.exit(1)
        }
        else{
            files.forEach((file)=>{
                const stream = fs.createReadStream(
                      path.join(directoryWithStyles, file),
                      'utf-8'
                    );
                stream.on('data', (data) => fs.appendFile(path.join(projectDist, 'style.css'), data, (err)=>{
                    if(err){
                        stdout.write(err)
                        process.exit(1)
                    }
                }));
                stream.on('error', (err) => {
                    stdout.write( err);
                });
            })
        }
        })


}


fs.promises.rm(projectDist, { recursive: true, force: true }).then(()=>{
    fs.promises.mkdir(projectDist).then(()=> {
        fs.promises.mkdir(directoryToFill)
    stdout.write('Directory created successfully\n');
    copyAllNestedFiles(directoryToCopy, directoryToFill)
    bundleStyles()
    })
})
