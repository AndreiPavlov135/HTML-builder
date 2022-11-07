const fs = require("fs");
const path = require("path");
const pathStyles = path.join(__dirname, "/styles/");
const pathBundle = path.join(__dirname, "/project-dist/bundle.css");

fs.readdir(pathStyles, { withFileTypes: true }, (err, files) => {
  if (err) console.log(err);
  fs.stat(pathBundle, (err) => {
    if (!err) {
      fs.truncate(pathBundle, (err) => {
        if (err) throw err;
      });
    }
  });

  files.forEach((file) => {
    fs.stat(path.join(pathStyles, file.name), (err) => {
      if (err) {
        console.log(err);
      } else {
        const arrStyles = file.name.split(".");
        if (arrStyles[1] === "css") {
          const stream = fs.createReadStream(
            path.join(pathStyles, file.name),
            "utf-8"
          );
          stream.on("data", (chunk) =>
            fs.appendFile(pathBundle, chunk, (err) => {
              if (err) throw err;
            })
          );
        }
      }
    });
  });
});
