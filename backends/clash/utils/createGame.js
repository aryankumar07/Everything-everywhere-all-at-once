import { db } from "../db/index.js";
import { WebSocket } from "ws";

export const createGame = (req, res) => {
  const { clientId, gameId } = req.body
  if (db.has(gameId)) {
    res.status(400).json({
      msg: "gameId already exist somehow"
    })
  }
  const player = new Set();
  player.add(clientId)
  db.set(gameId, player)
  const ws = new WebSocket("ws://localhost:8000/ws")
  res.status(200).json({
    msg: "Lobby created and player enterd in the room",
    isAdmin: true,
  })
}
