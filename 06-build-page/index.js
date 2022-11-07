const fs = require("fs");
const path = require("path");
const pathThemplate = path.join(__dirname, "template.html");
const pathStylesFrom = path.join(__dirname, "/styles/");
const pathStylesTo = path.join(__dirname, "/project-dist/style.css");
const pathDist = path.join(__dirname, "/project-dist/");
const pathAssetsFrom = path.join(__dirname, "/assets/");
const pathAssetsTo = path.join(__dirname, "/project-dist/assets");
const pathComponents = path.join(__dirname, "/components/");
const pathIndex = path.join(__dirname, "/project-dist/index.html");
const stream = fs.createReadStream(pathThemplate, "utf-8");
let str = "";

function parsToArray() {
  fs.readdir(pathComponents, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        fs.stat(path.join(pathComponents, file.name), (err) => {
          if (err) {
            console.log(err);
          } else {
            let arrHtml = file.name.split(".");
            if (arrHtml[1] === "html") {
              fs.readFile(
                path.join(pathComponents, file.name),
                "utf8",
                (err, data) => {
                  str = str.replace("{{" + arrHtml[0] + "}}", data);
                  fs.stat(pathIndex, (err) => {
                    if (!err) {
                      fs.truncate(pathIndex, (err) => {
                        if (err) throw err;
                        fs.writeFile(pathIndex, str, (err) => {
                          if (err) throw err;
                        });
                      });
                    } else if (err.code === "ENOENT") {
                      fs.writeFile(pathIndex, str, (err) => {
                        if (err) throw err;
                      });
                    }
                  });
                }
              );
            }
          }
        });
      });
    }
  });
}

function copyDir(pathFrom, pathTo) {
  fs.readdir(pathFrom, { withFileTypes: true }, (err, files) => {
    files.forEach((file) => {
      fs.stat(path.join(pathFrom, file.name), (err, stats) => {
        if (!stats.isFile()) {
          fs.stat(path.join(pathTo, file.name), (err) => {
            if (!err) {
              copyDir(
                path.join(pathFrom, file.name),
                path.join(pathTo, file.name)
              );
            } else if (err.code === "ENOENT") {
              fs.mkdir(path.join(pathTo, file.name), (err) => {
                if (err) throw err;
                copyDir(
                  path.join(pathFrom, file.name),
                  path.join(pathTo, file.name)
                );
              });
            }
          });
        } else {
          fs.copyFile(
            path.join(pathFrom, file.name),
            path.join(pathTo, file.name),
            (err) => {
              if (err) throw err;
            }
          );
        }
      });
    });
  });
}

function copyStyles() {
  fs.readdir(pathStylesFrom, { withFileTypes: true }, (err, files) => {
    if (err) console.log(err);
    else {
      fs.stat(pathStylesTo, (err) => {
        if (!err) {
          fs.truncate(pathStylesTo, (err) => {
            if (err) throw err;
          });
        }
      });

      files.forEach((file) => {
        fs.stat(path.join(pathStylesFrom, file.name), (err, stats) => {
          if (err) {
            console.log(err);
          } else {
            let arrName = file.name.split(".");
            if (arrName[1] === "css") {
              let stream = fs.createReadStream(
                path.join(pathStylesFrom, file.name),
                "utf-8"
              );
              stream.on("data", (chunk) =>
                fs.appendFile(pathStylesTo, chunk, (err) => {
                  if (err) throw err;
                })
              );
            }
          }
        });
      });
    }
  });
}

function startProject() {
  copyDir(pathAssetsFrom, pathAssetsTo);
  copyStyles();
  parsToArray();
}

stream.on("data", (chunk) => (str += chunk));
stream.on("end", () => {
  fs.stat(pathDist, (err) => {
    if (!err) {
      startProject();
    } else if (err.code === "ENOENT") {
      fs.mkdir(pathDist, (err) => {
        if (err) throw err;
        fs.mkdir(pathAssetsTo, (err) => {
          if (err) throw err;
          startProject();
        });
      });
    }
  });
});
