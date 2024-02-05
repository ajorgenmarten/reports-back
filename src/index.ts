import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import './types'

dotenv.config()
const app = express()

import './database'
import { COOKIE_PARSER_SECRET, PORT } from './config'
import { router } from './libs/autoload'

app.use(cors())
app.use(cookieParser(COOKIE_PARSER_SECRET))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(morgan('dev'))

app.use(router)

app.get('/ping', async (req, res) => {
    res.send('pong')
})

app.listen(PORT, () => console.log('⚡ Server started...'))
