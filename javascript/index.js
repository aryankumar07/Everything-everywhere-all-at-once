import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import path from "path";
import fs from "fs/promises";
import { publisher, subscriber } from "./client.js";

const PORT = process.env.PORT || 3000;
const CHANNEL = "redis-broker";

const server = http.createServer(async (req, res) => {
  try {
    const filePath = await fs.readFile(
      path.resolve("./index.html"),
      "utf-8"
    );

    res.setHeader("Content-Type", "text/html");
    res.end(filePath);
  } catch (err) {
    res.statusCode = 500;
    res.end("Could not load index.html");
  }
});

const websocketServer = new WebSocketServer({ server });

subscriber.subscribe(CHANNEL, (err, count) => {
  if (err) {
    console.error("Redis subscription error:", err);
    return;
  }

  console.log(`Subscribed to ${count} Redis channel(s)`);
});

subscriber.on("message", (channel, message) => {
  if (channel !== CHANNEL) return;

  websocketServer.clients.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send(`The message sent by someone is: ${message}`);
    }
  });
});

websocketServer.on("connection", (socket) => {
  console.log("Browser connected");

  socket.on("message", async (message) => {
    try {
      await publisher.publish(
        CHANNEL,
        `broker:${message.toString()}`
      );
    } catch (err) {
      console.error("Redis publish error:", err);
    }
  });

  socket.on("close", (code, reason) => {
    console.log("Connection closed:", code, reason.toString());
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });
});

process.on("SIGINT", async () => {
  console.log("\nShutting down server...");

  websocketServer.clients.forEach((socket) => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.close(1001, "Server shutting down");
    }
  });

  try {
    await subscriber.unsubscribe(CHANNEL);
    await subscriber.quit();
    await publisher.quit();
  } catch (err) {
    console.error("Redis shutdown error:", err);
  }

  websocketServer.close(() => {
    server.close(() => {
      console.log("Server closed safely");
      process.exit(0);
    });
  });

  setTimeout(() => {
    console.log("Force closing...");
    process.exit(1);
  }, 5000).unref();
});

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
});
