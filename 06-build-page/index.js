const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('process');

const directoryWithStyles = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');


const directoryToCopy = path.join(__dirname, 'assets')
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
    fs.writeFile(projectDist,'style.css', ()=>{stdout.write('Styles bundled successfully\n')});

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


function createIndexHtml () {
    fs.appendFile(path.join(projectDist,'index.html'),'', ()=>{stdout.write('Index.html created successfully\n')});
    fs.readdir(path.join(__dirname),{ withFileTypes: true }, (err,files)=>{
        if(err){
            stdout.write(err)
            process.exit(1)
        } else {
            files.forEach((file)=>{
                if(file.name === 'template.html'){
                    const readableStream = fs.createReadStream(path.join(__dirname, file.name),'utf-8');
                    readableStream.on("data", (chunk) => {
                        let template = chunk;
                        if(template.includes('{{footer}}')){
                            const readableStream = fs.createReadStream(path.join(__dirname,'components', 'footer.html'),'utf-8');
                            readableStream.on("data", (chunk) => {
                             template = template.replace('{{footer}}', chunk)
                            // fs.appendFile(path.join(projectDist,'index.html'),template, ()=>{})
                            })
                        }
                        if(template.includes('{{header}}')){
                            const readableStream = fs.createReadStream(path.join(__dirname,'components', 'header.html'),'utf-8');
                            readableStream.on("data", (chunk) => {
                             template = template.replace('{{header}}', chunk)

                            // fs.writeFile(path.join(projectDist,'index.html'),template, ()=>{})
                            })
                        }
                        if(template.includes('{{articles}}')){
                            const readableStream = fs.createReadStream(path.join(__dirname,'components', 'articles.html'),'utf-8');
                            readableStream.on("data", (chunk) => {
                             template = template.replace('{{articles}}', chunk)
                            fs.writeFile(path.join(projectDist,'index.html'),template, ()=>{})

                            // fs.appendFile(path.join(projectDist,'index.html'),template, ()=>{})
                            })
                        }
                        // fs.writeFile(path.join(projectDist,'index.html'),template, ()=>{})


                    });
                }
            })
        }
    })
}


fs.promises.rm(projectDist, { recursive: true, force: true }).then(()=>{
    fs.promises.mkdir(projectDist).then(()=> {
        fs.promises.mkdir(directoryToFill)
        stdout.write('Directory created successfully\n');
        copyAllNestedFiles(directoryToCopy, directoryToFill);
        bundleStyles();
        createIndexHtml();
    })
})
