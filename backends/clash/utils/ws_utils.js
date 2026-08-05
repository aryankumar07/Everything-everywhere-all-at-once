import { room, db } from "../db/index.js"


// Send a payload to every open socket in a game's room.
const broadCastData = (gameId, payload) => {
  const sockets = room.get(gameId)
  if (!sockets) return
  const data = JSON.stringify(payload)
  for (const client of sockets) {
    if (client.readyState === client.OPEN) {
      client.send(data)
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
      room.set(gameId, new Set())
    }
    socket.gameId = gameId
    room.get(gameId).add(socket)

    // Tell the whole room how many of the expected players are now connected,
    // so clients can start the countdown once everyone is in.
    const total = db.get(gameId).players.length
    broadCastData(gameId, {
      type: "READY",
      code: 200,
      count: room.get(gameId).size,
      total,
    })
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
    broadCastData(gameId, {
      type: "CLICK",
      code: 200,
      index,
      color,
    })
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
    const gameId = socket.gameId
    if (!gameId || !db.has(gameId) || !room.has(gameId)) {
      return socket.send(JSON.stringify({
        type: "ERROR",
        code: 400,
        msg: "No Game found"
      }))
    }
    broadCastData(gameId, {
      type: "STOP",
      code: 200,
      name,
    })
  } catch (err) {
    return socket.send(JSON.stringify({
      type: "ERROR",
      code: 500,
      msg: "Backend Faced some issue"
    }))
  }
}


// Remove a socket from its room when it disconnects.
export const handleDisconnect = (socket) => {
  const gameId = socket.gameId
  if (!gameId || !room.has(gameId)) return
  room.get(gameId).delete(socket)
}
