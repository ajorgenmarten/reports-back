import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './types'

dotenv.config()
const app = express()

import './database'
import { PORT } from './config'
import { router } from './libs/autoload'
import { handleCors } from './cors'
import { isAuth, requireAuth } from './services/auth/middlewares'

app.use(cors({ origin: handleCors, credentials: true }))
app.use(cookieParser())
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(morgan('dev'))

app.use(isAuth)
app.use(router)

app.get('/ping', async (req, res) => {
    res.send('pong')
})

app.listen(PORT, () => console.log('⚡ Server started...'))
