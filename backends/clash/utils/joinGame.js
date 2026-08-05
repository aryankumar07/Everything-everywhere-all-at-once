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

  // Idempotent by clientId: drop any existing entry for this player before
  // adding, so re-joining (e.g. returning to the lobby after a round) updates
  // them in place instead of creating a duplicate.
  const others = gameData["players"].filter((p) => p.clientId !== clientId)
  gameData = {
    ...gameData,
    players: [
      ...others,
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
