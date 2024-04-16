import { RequestHandler } from "express"

import { jwtDecode, jwtDecodeRefresh } from "../../libs/jsonwebtoken"

import { UserModel } from "./models"
import { cleanAccessToken, getSessionSecret } from "./helper"
import { AccessTokenValidator } from "./validator"
import { AccessTokenPayload, RefreshTokenPayload, User } from "./types"

import { handleResponse } from "../../libs/http"
import lang from "../../lang"
import authRoutes from '../../mocks/auhtroutes'

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
        status: 401,
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
        
        const follow = canFollow(req.originalUrl, authUser.role)
        
        if (!follow) return handleResponse(res, {
            success: false,
            message: lang.services.auth.middlewares.dontCanFollow,
            status: 403
        })

        const token = cleanAccessToken( req.headers.authorization )

        if (!token) return handleResponse(res, {
            success: false,
            message: lang.libs.jsonwebtoken.invalidToken,
            status: 401
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

const canFollow = (path: string, role: User['role']) => {
    path = removeParams(path)
    const route = authRoutes.find(authRoute => authRoute.path == path)
    if ( !route ) return true
    if ( route.roles.includes(role) ) return true
    return false
}

const removeParams = (path: string) => {
    return path.split('?')[0]
}





//EN ESTA PARTE ESTOY CREANDO NUEVAS FUNCIONALIDADES PARA LA AUTENTICACION
//LA IDEA ES PONER UN MIDDLEWARE GENERAL QUE ESTABLEZCA SI LOS USUARIOS ESTAN LOGUEADOS O NO

export const isAuthExperimental: RequestHandler = async (req, res, next) => {
    
    req.isAuth = false

    if ( !req.cookies.refreshToken ) {
        return next()
    }
    
    const verifyResult = jwtDecodeRefresh<RefreshTokenPayload>(req.cookies.refreshToken)
    
    if ( !verifyResult.success ) {
        if (verifyResult.errorMsg == lang.libs.jsonwebtoken.expired) {
            res.clearCookie('refreshToken')
        }
        return next()
    }

    const userAccount = await UserModel.findOne({username: verifyResult.payload?.username}, '+sessions +sessions.secret') 

    if ( !userAccount ) {
        return next()
    }

    if ( !userAccount.status ) {
        return next()
    }

    req.isAuth = true
    req.session = verifyResult.payload?.sid
    req.user = userAccount
    next()
}

export const requireAuth: RequestHandler = async (req, res, next) => {
    if ( req.isAuth ) 
        return next()
    return handleResponse(res, {
        success: false,
        message: lang.services.auth.middlewares.noAuth,
        status: 401
    })
}