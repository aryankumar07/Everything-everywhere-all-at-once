import http from "http"
import { createGame } from "./utils/createGame.js";
import { joinGame } from "./utils/joinGame.js";
import { getPlayer } from "./utils/getplayer.js";
import { startGame } from "./utils/startGame.js";
import { WebClient } from "./utils/webClient.js";
import express from 'express'
import cors from 'cors'

const PORT = process.env.PORT || 8000

const app = express()

app.use(cors())
app.use(express.json())
const server = http.createServer(app)


app.get('/', (_, res) => { res.send("Hello World") })
app.post('/create', createGame)
app.post('/join', joinGame)
app.post('/getPlayer/:gameId', getPlayer)
app.post('/start/:gameId', startGame)
WebClient(server, "/ws")

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`)
})

