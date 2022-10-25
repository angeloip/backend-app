const { spawn } = require("child_process");
const { once } = require("events");

const apriori = async (text) => {
  let res;
  const pythonProcess = spawn("python", ["./src/python/apriori.py", text]);

  pythonProcess.stdout.on("data", (data) => {
    res = data.toString().trim();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("exit", (code) => {});

  await once(pythonProcess, "close");

  return res;
};

module.exports = { apriori };
