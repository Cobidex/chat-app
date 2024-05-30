const net = require("net");

const server = net.createServer();

const clients = [];

server.on("connection", (socket) => {
  console.log("A new connection was made to the server!");
  const clientId = clients.length + 1;

  clients.map((clients) => {
    clients.socket.write(`User ${clientId} joined!`);
  });
  clients.push({ id: clientId.toString(), socket });
  socket.write(`id-${clientId}`);

  socket.on("data", (data) => {
    const [id, message] = data.toString("utf8").split("-message-");
    clients.forEach((client) => {
      client.socket.write(`> User ${id}: ${message}`);
    });
  });

  socket.on("end", () => {
    clients.map((clients) => {
      clients.socket.write(`User ${clientId} left!`);
    });
  });
});

server.listen(3099, "127.0.0.1", () => {
  console.log("opened server on ", server.address());
});
