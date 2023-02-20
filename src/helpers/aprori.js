const { spawn } = require("child_process");
const { once } = require("events");

const apriori = async (text) => {
  let res;
  const pythonProcess = spawn("python", ["main.py", JSON.stringify(text)]);

  pythonProcess.stdout.on("data", (data) => {
    res = data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    res.send(JSON.stringify({ width: data.toString() }));
  });

  pythonProcess.on("exit", (code) => {
    console.log("CODE: ", code);
  });

  await once(pythonProcess, "close");

  return res;
};

module.exports = { apriori };
