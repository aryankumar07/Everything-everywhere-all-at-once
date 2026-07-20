import { db, broadCastConnection } from "../db/index.js"

export const BroadCastPlayer = (gameId) => {
  const payload = db.get(gameId)
  const connections = broadCastConnection.get(gameId)
  if (!connections) return
  for (const response of connections)
    response.write(`data:${JSON.stringify(payload)}\n\n`)
}


export const getPlayer = (req, res) => {
  const { gameId } = req.params

  console.log("params:", req.params)
  console.log("db keys:", [...db.keys()])
  console.log("db entries:", [...db.entries()])
  console.log("looking up:", gameId, "has?", db.has(gameId))

  if (!db.has(gameId)) {
    return res.status(400).json({
      msg: "No GameId found"
    })
  }

  const connections = new Set()
  connections.add(res)

  broadCastConnection.set(gameId, connections)

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
  })

  res.write(`data:connection established\n\n`)

  const pingInterval = setInterval(() => {
    res.write("data:ping\n\n")
  }, 25000)

  res.on("close", () => {
    clearInterval(pingInterval)
  })

}
