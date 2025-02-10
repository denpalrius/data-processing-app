const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 8081;

app.use(cors());
app.use(express.json());

const clients = new Set();

// Function to format SSE messages
function formatSSEMessage(data) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

// SSE endpoint
app.get("/events", (req, res) => {
  // SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
  });

  const data = {
    type: "connect",
    message: "Connected to SSE server",
  };

  res.write(formatSSEMessage(data));

  clients.add(res);
  console.log("Client connected, total clients:", clients.size);

  req.on("close", () => {
    clients.delete(res);
    console.log("Client disconnected, total clients:", clients.size);
  });
});

// Endpoint to broadcast a message to all clients
app.post("/broadcast", (req, res) => {
  console.log("Broadcast received: \n", "data:", JSON.stringify(req.body));

  broadcastToAll(req.body);
  res.json({ success: true, connectedClients: clients.size });
});

function broadcastToAll(data) {
  const message = formatSSEMessage(data);
  clients.forEach((client) => client.write(message));
}

// For testing: Start periodic updates
// let counter = 0;
// setInterval(() => {
//   const data = {
//     type: "update",
//     count: counter++,
//     timestamp: new Date().toISOString(),
//   };
//   broadcastToAll(data);
// }, 10000);

app.listen(PORT, () => {
  console.log(`SSE Server running at http://localhost:${PORT}`);
});
