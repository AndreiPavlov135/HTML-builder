const fs = require("fs");
const path = require("path");
const readline = require("readline");
const { stdin: input, stdout: output } = require("process");
const rl = readline.createInterface({ input, output });

const startText = "Hi! Enter text pls:\n";
const fixText = "Smth else?\n";
const finishText = "Best wishes!\n";

fs.createWriteStream(path.join(__dirname, "text.txt"));

output.write(startText);

rl.prompt();

rl.on("line", (input) => {
  input !== "exit"
    ? fs.appendFile(path.join(__dirname, "text.txt"), input + " ", (err) => {
        if (err) throw err;
        output.write(fixText);
        rl.prompt();
      })
    : rl.close();
});

rl.on("close", () => output.write(finishText));
