import { db } from "../db/index.js";
import { BroadCastPlayer } from "./getplayer.js";

export const createGame = (req, res) => {
  const { clientId, playerName, color, isAdmin, timer } = req.body
  const gameId = String(req.body.gameId)

  if (db.has(gameId)) {
    return res.status(400).json({
      msg: "gameId already exist somehow"
    })
  }


  const gameDetails = {
    duration: timer,
    players: [
      { clientId, playerName, color, isAdmin },
    ],
  }
  const connnectionSet = new Set()
  connnectionSet.add(res)
  db.set(gameId, gameDetails)
  BroadCastPlayer(gameId)

  return res.status(200).json({
    msg: "Lobby created and player entered in the room",
    gameId,
    gameDetails,
  })
}
