import { RequestHandler } from "express"

import { jwtDecode, jwtDecodeRefresh } from "../../libs/jsonwebtoken"

import { UserModel } from "./models"
import { cleanAccessToken, getSessionSecret } from "./helper"
import { AccessTokenValidator } from "./validator"
import { AccessTokenPayload, RefreshTokenPayload, User } from "./types"

import { handleResponse } from "../../libs/http"
import lang from "../../lang"

export const existUserWithUsername: RequestHandler = async (req, res, next) => {
    const users = await UserModel.findOne({username: req.body.username})
    if(users) return handleResponse(res,{ success: false,
                                            message: lang.services.auth.middlewares.existUserWithUsername,
                                            status: 400 })
    next()
}


export const existUserWithEmail: RequestHandler = async (req, res, next) => {
    const users = await UserModel.findOne({email: req.body.email})
    if(users) return handleResponse(res,{ success: false,
                                            message: lang.services.auth.middlewares.existUserWithEmail,
                                            status: 400 })
    next()
}

export const isAuth: RequestHandler = async (req, res, next) => {
    
    if( !req.cookies.refreshToken ) return handleResponse(res,{
        success: false,
        message: lang.services.auth.middlewares.validateRefreshToken,
        status: 400,
    })
    
    const verifyJwtResult = jwtDecodeRefresh<RefreshTokenPayload>(req.cookies.refreshToken)

    if( !verifyJwtResult.success ) {
        if (verifyJwtResult.errorMsg == lang.libs.jsonwebtoken.expired) {
            res.clearCookie('refreshToken')
        }
        return handleResponse(res,{
            success: false,
            message: verifyJwtResult.errorMsg,
            status: 401
        })
    }

    const userAccount = await UserModel.findOne({username: verifyJwtResult.payload?.username}, '+sessions +sessions.secret')

    if ( !userAccount ) return handleResponse(res,{
        success: false,
        message: lang.services.auth.middlewares.getAuthUserNotFound,
        status: 401,
    })

    if ( !userAccount.status ) return handleResponse(res,{
        success: false,
        message: lang.services.auth.controllers.resendCodeNotFound
    })

    req.session = verifyJwtResult.payload?.sid
    req.user = userAccount
    next()
}

/**
 * Este middleware debe ser pasado a las rutas como invocacion [con los paréntesis al final "()"]
 */
export const can = () => {
    
    const canHandler: RequestHandler = (req, res, next) => {
        const authUser = req.user as User
        const token = cleanAccessToken( req.header('Authorization') )

        if (!token) return handleResponse(res, {
            success: false,
            message: lang.libs.jsonwebtoken.invalidToken,
            status: 400
        })

        const secret = getSessionSecret(req.user as User, req.session as string ) as string
        const verifyJwtResult = jwtDecode<AccessTokenPayload>(token, secret)

        if ( !verifyJwtResult.success ) return handleResponse(res,{
            success: false,
            message: verifyJwtResult.errorMsg,
            status: 401,
        })

        if ( verifyJwtResult.payload?.username != authUser.username ) return handleResponse(res,{
            success: false,
            message:lang.services.auth.middlewares.canUsernamesNotMatch,
            status: 401,
        })

        next()

    }
    return [ ...AccessTokenValidator, canHandler]
}