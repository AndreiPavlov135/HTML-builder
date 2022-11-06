const fs = require("fs");
const path = require("path");
const pathFiles = path.join(__dirname, "files");
const pathFilesCopy = path.join(__dirname, "files-copy");

function copyDir() {
  fs.readdir(pathFiles, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.copyFile(
        path.join(pathFiles, file.name),
        path.join(pathFilesCopy, file.name),
        (err) => {
          if (err) throw err;
        }
      );
    });
  });
}

function createCopyDir() {
  fs.mkdir(pathFilesCopy, (err) => {
    if (err) throw err;
    copyDir();
  });
}

function changeCopyDir() {
  fs.readdir(pathFilesCopy, { withFileTypes: true }, (err, files) => {
    if (err) throw err;
    files.forEach((file) => {
      fs.unlink(path.join(pathFilesCopy, file.name), (err) => {
        if (err) throw err;
      });
    });
    copyDir();
  });
}

fs.stat(pathFilesCopy, (stats) => {
  stats ? createCopyDir() : changeCopyDir();
});
