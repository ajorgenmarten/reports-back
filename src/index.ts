import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()

import './database'
import { COOKIE_PARSER_SECRET, PORT } from './config'

import auth from './services/auth/routes'

app.use(cookieParser(COOKIE_PARSER_SECRET))
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(morgan('dev'))

app.use((req, res, next) => {
    console.log(req.query)
    next()
})
app.use('/auth',auth)

app.listen(PORT, () => console.log('server started...'))
