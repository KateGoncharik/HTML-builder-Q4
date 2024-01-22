const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('process');

const stylesDirectory = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');

const assetsFrom = path.join(__dirname, 'assets');
const assetsTo = path.join(projectDist, 'assets');

function handleError(err) {
  if (err) {
    stdout.write(`${err}`);
    process.exit(1);
  }
}

function copyAllNestedFiles(sourcePath, destinationPath) {
  fs.readdir(sourcePath, { withFileTypes: true }, (err, files) => {
    handleError(err);
    files.forEach((file) => {
      const sourceFilePath = path.join(sourcePath, file.name);
      const destinationFilePath = path.join(destinationPath, file.name);
      if (file.isDirectory()) {
        fs.promises.mkdir(destinationFilePath).then(() => {
          copyAllNestedFiles(sourceFilePath, destinationFilePath);
        });
      } else {
        fs.copyFile(sourceFilePath, destinationFilePath, handleError);
      }
    });
  });
}

function bundleStyles() {
  fs.readdir(stylesDirectory, (err, files) => {
    handleError(err);
    files.forEach((file) => {
      const stream = fs.createReadStream(
        path.join(stylesDirectory, file),
        'utf-8',
      );
      stream.on('data', (data) =>
        fs.appendFile(path.join(projectDist, 'style.css'), data, handleError),
      );
      stream.on('error', handleError);
    });
  });
}

function createIndexHtml() {
  const readableStreamTemplate = fs.createReadStream(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  readableStreamTemplate.on('data', (chunk) => {
    let template = chunk;

    const regex = /\{\{([^}]+)\}\}/g;
    const tags = template.match(regex);

    tags.forEach((tag) => {
      const componentName = `${tag.slice(2, -2)}.html`;

      fs.readdir(path.join(__dirname, 'components'), (err, files) => {
        if (!files.includes(componentName)) {
          console.log(`${componentName} is not in ${files}`);
          process.exit(1);
        }
      });

      const componentContentStream = fs.createReadStream(
        path.join(__dirname, 'components', componentName),
        'utf-8',
      );
      componentContentStream.on('data', (chunk) => {
        template = template.replace(tag, chunk);
        fs.writeFile(path.join(projectDist, 'index.html'), template, () => {});
      });
    });
  });
}

fs.promises.rm(projectDist, { recursive: true, force: true }).then(() => {
  fs.promises.mkdir(projectDist).then(() => {
    fs.promises.mkdir(assetsTo);
    stdout.write('Directory created successfully\n');
    copyAllNestedFiles(assetsFrom, assetsTo);
    bundleStyles();
    createIndexHtml();
  });
});
