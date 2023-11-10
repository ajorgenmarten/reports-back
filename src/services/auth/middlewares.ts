import { RequestHandler } from "express"

import { jwtDecodeRefresh } from "../../libs/jsonwebtoken"

import { UserModel } from "./models"
import { RefreshTokenPayload } from "./types"

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

export const checkRefreshTokenSigned: RequestHandler = (req, res, next) => {
    if( !req.signedCookies.refreshToken ) return res.status(400).json({
        success: false,
        data: undefined,
        message: lang.services.auth.middlewares.validateRefreshTokenSigned,
        status: 400,
    })
    next()
}

export const isAuth: RequestHandler = async (req, res, next) => {
    const verifyJwtResult = jwtDecodeRefresh<RefreshTokenPayload>(req.signedCookies.refreshToken)

    if( !verifyJwtResult.success ) return res.status(401).json({
        success: false,
        message: verifyJwtResult.errorMsg,
        status: 401
    })

    const userAccount = await UserModel.findOne({username: verifyJwtResult.payload?.username}, '+sessions.secret')

    if ( !userAccount ) return res.status(401).json({
        success: false,
        message: lang.services.auth.middlewares.getAuthUserNotFound,
        data: undefined,
        status: 401,
    })

    if ( !userAccount.status ) return res.status(401).json({
        success: false,
        message: lang.services.auth.controllers.resendCodeNotFound
    })

    req.body.accountSid = verifyJwtResult.payload?.sid
    req.user = userAccount
    next() 

}