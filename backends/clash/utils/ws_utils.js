import { room, db } from "../db/index.js"


const broadCastData = (gameId, payload, socket) => {
  const rooms = room.get(gameId)
  for (const client in rooms) {
    if (client !== socket || client.readyState === socket.OPEN) {
      client.send(JSON.stringify(payload))
    }
  }
}


export const JoinPlayers = (socket, gameId) => {
  try {
    if (!db.has(gameId)) {
      return socket.send(JSON.stringify({
        type: "ERROR",
        code: 400,
        msg: "No Game found"
      }))
    }
    if (!room.has(gameId)) {
      const sockets = new Set()
      room.set(gameId, sockets)
    }
    room.get(gameId).add(socket)
    return socket.send(JSON.stringify({
      type: "join",
      code: 200,
      msg: "Player joined"
    }))
  } catch (err) {
    return socket.send(JSON.stringify({
      type: "ERROR",
      code: 500,
      msg: "Backend faced some issues"
    }))
  }
}


export const handleClick = (socket, gameId, color, index) => {
  try {
    if (!db.has(gameId) || !room.has(gameId)) {
      return socket.send(JSON.stringify({
        type: "ERROR",
        code: 400,
        msg: "No Game found"
      }))
    }
    const payload = {
      type: "CLICK",
      code: 200,
      index,
      color
    }
    broadCastData(payload)
  } catch (err) {
    return socket.send(JSON.stringify({
      type: "ERROR",
      code: 500,
      msg: "Backend Faced some issue"
    }))
  }
}

export const handleStop = (socket, name) => {
  try {
    if (!db.has(gameId) || !room.has(gameId)) {
      return socket.send(JSON.stringify({
        type: "ERROR",
        code: 400,
        msg: "No Game found"
      }))
    }
    const payload = {
      type: "STOP",
      code: 200,
      name
    }
    broadCastData(payload)
  } catch (err) {
    return socket.send(JSON.stringify({
      type: "ERROR",
      code: 500,
      msg: "Backend Faced some issue"
    }))
  }
}
