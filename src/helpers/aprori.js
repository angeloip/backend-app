const { spawn } = require("child_process");
const { once } = require("events");

const apriori = async (text) => {
  let res;
  const pythonProcess = spawn("python", [
    "./src/python/apriori.py",
    JSON.stringify(text)
  ]);

  pythonProcess.stdout.on("data", (data) => {
    res = data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  pythonProcess.on("exit", (code) => {
    console.log("CODE: ", code);
  });

  await once(pythonProcess, "close");

  return res;
};

module.exports = { apriori };
