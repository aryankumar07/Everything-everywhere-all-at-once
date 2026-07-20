import { WebSocketServer } from "ws";
import { handleClick, handleStop, JoinPlayers } from "./ws_utils.js";


export const WebClient = (server, path) => {
  const webServer = WebSocketServer({ server, path })
  webServer.on("connection", (socket) => {
    console.log("WebSockeet Connected")
    socket.gameId = null
    socket.on("message", (raw) => {
      const msg = JSON.parse(raw)
      const { type, gameId, color, index, name } = msg
      switch (type) {
        case "JOIN":
          JoinPlayers(socket, String(gameId))
          break;
        case "CLICK":
          handleClick(socket, String(gameId), color, index)
          break;
        case "STOP":
          handleStop(socket, name)
          break;
        default:
          socket.send(JSON.stringify({
            code: 500,
            mag: "Unknown type"
          }))
          break;
      }
    })
  })
}
