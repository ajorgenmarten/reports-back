import { RequestHandler } from "express"

import { UserModel } from "./models"

import lang from "../../lang"

export const existUserWithUsername: RequestHandler = async (req, res, next) => {
    const users = await UserModel.find({username: req.body.username})
    if(users.length) return res.status(400).json({ success: false,
                                            data: undefined,
                                            message: lang.services.auth.middlewares.existUserWithUsername,
                                            status: 400 })
    next()
}


export const existUserWithEmail: RequestHandler = async (req, res, next) => {
    const users = await UserModel.find({email: req.body.email})
    if(users.length) return res.status(400).json({ success: false,
                                            data: undefined,
                                            message: lang.services.auth.middlewares.existUserWithEmail,
                                            status: 400 })
    next()
}

export const validateRefreshTokenSigned: RequestHandler = (req, res, next) => {
    if( !req.signedCookies.refreshToken ) return res.json({
        success: false,
        data: undefined,
        message: lang.services.auth.middlewares.validateRefreshTokenSigned,
        status: 400,
    })
    next()
}