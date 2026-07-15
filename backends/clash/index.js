import http from "http"
import { WebSocketServer } from "ws";
import { createGame } from "./utils/createGame.js";
import { joinGame } from "./utils/joinGame.js";
import express from 'express'

const PORT = process.env.PORT || 8000

const app = express()

app.use(express.json())


app.get('/', (_, res) => { res.send("Hello World") })
app.post('/create', createGame)
app.post('/join', joinGame)


const server = http.createServer(app)

const rooms = new Map()

const webSocketServer = new WebSocketServer({ server, path: '/ws' })

webSocketServer.on("connection", (socket) => {

  console.log("WebSockeet Working")
  socket.gameId = null

  socket.on("message", (raw) => {
    const msg = JSON.parse(raw)

    if (msg.type === 'join') {
      socket.gameId = msg.gameId
      if (!rooms.has(msg.gameId)) {
        rooms.set(msg.gameId, new Set())
      }
      rooms.get(msg.gameId).add(socket)
    } else if (msg.type === 'cellClick') {
      const room = rooms.get(msg.gameId)
      if (!room) {
        return;
      }
      for (const client of room) {
        if (client !== socket && client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: 'cellClick',
            index: msg.index,
            color: msg.color
          }))
        }
      }
    } else if (msg.type === "stop") {
      const room = rooms.get(msg.gameId)
      console.log("[ws] stop received for", msg.gameId, "room size:", room ? room.size : 0)
      if (!room) {
        return
      }
      for (const client of room) {
        if (client.readyState === client.OPEN) {
          client.send(JSON.stringify({
            type: "stop",
            name: msg.name
          }))
        }
      }
    }

  })

  socket.on("close", (code, reason) => {
    console.log("Connection closed:", code, reason.toString());
    const room = rooms.get(socket.gameId)
    if (room) {
      room.delete(socket)
      if (room.size === 0) {
        rooms.delete(socket.gameId)
      }
    }
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err.message);
  });

})

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})

