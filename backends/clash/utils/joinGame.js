import { db, broadCastConnection } from "../db/index.js";
import { BroadCastPlayer } from "./getplayer.js";


export const joinGame = (req, res) => {
  const { playerName, clientId, color, isAdmin } = req.body;
  const gameId = String(req.body.gameId)

  if (!db.has(gameId) || !broadCastConnection.has(gameId)) {
    return res.status(400).json({
      msg: "Invalid GameId",
    });
  }
  let gameData = db.get(gameId)

  gameData = {
    ...gameData,
    players: [
      ...gameData["players"],
      { clientId, playerName, color, isAdmin },
    ]
  }
  db.set(gameId, gameData)
  BroadCastPlayer(gameId)

  return res.status(200).json({
    msg: "Added to the lobby",
    gameId,
    gameData
  });
};
