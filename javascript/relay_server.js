import http from 'http'
import { WebSocketServer } from 'ws'

const PORT = process.env.port || 5000


const relay_ports = [3000, 3001]

const server = http.createServer((req, res) => {
  res.end("<h1>Relay Server</h1>")
})

const websocketServer = new WebSocketServer({ server })





websocketServer.on("connection", (socket) => {
  console.log("relay server connected")

  socket.on("message", (msg) => {
    client.publish(CHANNEL, `broker:${JSON.stringify(msg)}`)
  })
  socket.on("close", (code, reason) => {
    console.log("connection closed:", code, reason.toString());
  });
  socket.on("error", (err) => {
    console.log("socket error:", err.message);
  });

})


server.listen(PORT, () => {
  console.log("relay server working on port : ", PORT)
})
