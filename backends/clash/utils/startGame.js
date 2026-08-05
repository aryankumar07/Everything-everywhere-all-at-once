import { db, broadCastConnection } from "../db/index.js"

// The admin hits this to start the game. We push a "START" sentinel down the
// lobby SSE stream every player already has open, so every client navigates to
// the game route together. The actual gameplay then runs over the WebSocket.
export const startGame = (req, res) => {
  const { gameId } = req.params

  if (!db.has(gameId)) {
    return res.status(400).json({ msg: "No GameId found" })
  }

  const connections = broadCastConnection.get(gameId)
  if (connections) {
    for (const response of connections) {
      response.write(`data:START\n\n`)
    }
  }

  return res.json({ msg: "Game started", gameId })
}
