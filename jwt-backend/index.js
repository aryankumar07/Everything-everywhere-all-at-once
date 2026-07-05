import Express from 'express'
import Cors from 'cors'
import cookieParser from 'cookie-parser'
import { connectDB } from './db/index.js'


import RegisterRoute from './Route/auth/register.js'
import LoginRoute from './Route/auth/login.js'
import GeneralRoute from './Route/general/index.js'
import RefreshRoute from './Route/auth/refresh.js'

const App = Express()
App.use(Express.json())
App.use(cookieParser())
App.use(Cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

App.use('/api/v1', RegisterRoute)
App.use('/api/v1', LoginRoute)
App.use('/api/v1', GeneralRoute)
App.use('/api/v1', RefreshRoute)

App.get('/', (_, res) => {
  res.status(200).json({
    message: "Hello World"
  })
})


connectDB().then(() => {
  App.listen(8080, () => {
    console.log("express server is live")
  })
})
