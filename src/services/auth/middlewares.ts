import { RequestHandler } from "express"

import { jwtDecode, jwtDecodeRefresh } from "../../libs/jsonwebtoken"

import { UserModel } from "./models"
import { getSessionSecret } from "./helper"
import { AccessTokenPayload, RefreshTokenPayload, User } from "./types"

import lang from "../../lang"
import { accessTokenValidator } from "./validator"
import { checkExpressValidatorMiddlewares } from "../../libs/check-express-validator-middlewares"

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

export const isAuth: RequestHandler = async (req, res, next) => {
    if( !req.signedCookies.refreshToken ) return res.status(400).json({
        success: false,
        data: undefined,
        message: lang.services.auth.middlewares.validateRefreshTokenSigned,
        status: 400,
    })
    
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

export const can = () => {
    
    const canHandler: RequestHandler = (req, res, next) => {
        console.log('handle can');
        const authUser = req.user as User
        const token = req.header('accessToken') as string
        const secret = getSessionSecret(req.user as User, req.body.accountSid) as string
        const verifyJwtResult = jwtDecode<AccessTokenPayload>(token, secret)

        if ( !verifyJwtResult.success ) return res.status(401).json({
            success: false,
            message: verifyJwtResult.errorMsg,
            status: 401,
        })

        if ( verifyJwtResult.payload?.username != authUser.username ) return res.status(401).json({
            success: false,
            message:lang.services.auth.middlewares.canUsernamesNotMatch,
            status: 401,
        })

        

        next()

    }
    return [ ...checkExpressValidatorMiddlewares(accessTokenValidator), canHandler]
}