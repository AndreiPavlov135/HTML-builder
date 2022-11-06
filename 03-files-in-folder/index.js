const fs = require("fs");
const path = require("path");
const pathSecretFolder = path.join(__dirname, "secret-folder");

fs.readdir(pathSecretFolder, { withFileTypes: true }, (err, files) => {
  if (err) throw err;
  for (const file of files) {
    if (file.isFile()) {
      fs.stat(path.join(pathSecretFolder, file.name), (err, stats) => {
        if (err) throw err;
        const fileInfo = file.name.split(".");
        console.log(`${fileInfo[0]} - ${fileInfo[1]} - ${stats.size / 1000}kb`);
      });
    }
  }
});
