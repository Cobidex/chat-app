const net = require("net");
const readLine = require("readline/promises");

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const clearLine = (dir) => {
  return new Promise((resolve, reject) => {
    process.stdout.clearLine(dir, () => {
      resolve();
    });
  });
};

const moveCursor = (dx, dy) => {
  return new Promise((resolve, reject) => {
    process.stdout.moveCursor(dx, dy, () => {
      resolve();
    });
  });
};

const HOST = process.env.HOST;
const PORT = process.env.PORT;

let id;

const socket = net.createConnection({ host: HOST, port: PORT }, async () => {
  console.log("Connected to server");

  const ask = async () => {
    const message = await rl.question("Enter a mesage > ");
    await moveCursor(0, -1);
    await clearLine(0);
    socket.write(`${id}-message-${message}`);
  };
  ask();

  socket.on("data", async (data) => {
    console.log();
    await moveCursor(0, -1);
    await clearLine(0);

    if (data.toString("utf8").startsWith("id-")) {
      id = data.toString("utf8").substring(3);
      console.log(`Your id is ${id}!\n`);
    } else {
      console.log(data.toString());
    }

    ask();
  });
});

socket.on("end", () => {
  console.log("connection closed");
});
