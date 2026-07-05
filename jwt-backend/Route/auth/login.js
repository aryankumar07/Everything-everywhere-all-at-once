import express from 'express'
import crypto from 'crypto'
import client from '../../db/index.js'
import bcrypt from 'bcrypt'
import { generateAccessToken, generateRefreshToken, setRefreshCookies } from '../../utils/index.js'

const router = new express.Router()

router.post('/login', async (req, res) => {

  const {
    email,
    password
  } = req.body


  if (!email || !password) {
    return res.status(400).json({
      error: "All fields required"
    })
  }

  const users = await client.query("select id, name , email, password from users where email = $1", [email])

  const user = users.rows[0]

  if (users.rows.length <= 0) {
    return res.status(404).json({
      error: "No users exist of such type"
    })
  }

  if (user && !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({
      error: "password is incorect"
    })
  }

  const family = crypto.randomUUID()

  const accesToken = generateAccessToken(user)
  const refreshToken = await generateRefreshToken(user.id, family)

  setRefreshCookies(res, refreshToken)

  return res.status(200).json({
    token: accesToken,
    user: { id: user.id, name: user.name, email: user.email }
  })
})

export default router
