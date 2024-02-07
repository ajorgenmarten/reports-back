import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './types'

dotenv.config()
const app = express()

import './database'
import { FRONTEND_URL, PORT } from './config'
import { router } from './libs/autoload'

app.use(cors({ origin: FRONTEND_URL, credentials: true }))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(morgan('dev'))

app.use((req, res, next) => {
    console.log(JSON.stringify(req.cookies))
    next()
})

app.use(router)

app.get('/ping', async (req, res) => {
    res.send('pong')
})

app.listen(PORT, () => console.log('⚡ Server started...'))
