import { db } from "../db/index.js";


export const joinGame = (req, res) => {
  const { gameId, clientId } = req.body;

  if (!db.has(gameId)) {
    return res.status(400).json({
      msg: "Invalid GameId",
    });
  }

  db.get(gameId).add(clientId);

  return res.status(200).json({
    msg: "Added to the lobby",
    isAdmin: false,
  });
};
