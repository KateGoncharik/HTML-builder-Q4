const fs = require('node:fs');
const path = require('node:path');
const { stdout } = require('process');

const directoryWithStyles = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');

fs.unlink(path.join(projectDist, 'bundle.css'), () => {});
fs.readdir(directoryWithStyles, (err, files) => {
  if (err) {
    stdout.write(err);
    process.exit(1);
  } else {
    files.forEach((file) => {
      if (path.extname(file) !== '.css') {
        return;
      }
      const stream = fs.createReadStream(
        path.join(directoryWithStyles, file),
        'utf-8',
      );
      stream.on('data', (data) =>
        fs.appendFile(path.join(projectDist, 'bundle.css'), data, (err) => {
          if (err) {
            stdout.write(err);
            process.exit(1);
          }
        }),
      );
      stream.on('error', (err) => {
        stdout.write(err);
      });
    });
  }
});
