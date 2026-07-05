import express from 'express'
import bcrypt from 'bcrypt'
import client from '../../db/index.js'

const router = new express.Router()

router.post('/register', async (req, res) => {

  const {
    name,
    email,
    password
  } = req.body


  if (name === undefined || email === undefined || password === undefined) {
    return res.status(400).json({
      error: "fields are missing"
    })
  }

  const existing = await client.query("select id from users where email = $1", [email])


  if (existing.rows.length > 0) {
    return res.status(402).json({
      error: "users already excit"
    })
  }

  const hashPassword = await bcrypt.hash(password, 12)

  await client.query("insert into users (name , email , password) values ($1 , $2 , $3)", [name, email, hashPassword])


  return res.status(200).json({
    message: "user Registered"
  })
})

export default router


