import { RequestHandler } from "express";
import { UAParser } from 'ua-parser-js'
import { randomUUID, randomBytes } from 'crypto'

import { jwtDecodeMail, jwtDecodeRefresh, jwtSignAccess, jwtSignMail, jwtSignRefresh } from "../../libs/jsonwebtoken";
import { loadMailTemplate, Mailer } from "../../libs/mailer";

import { UserModel } from "./models";
import { ActiveMailTokenPayload, RefreshTokenPayload, User } from "./types";

import { MAILER_CONFIG } from "../../config";
import lang from "../../lang";
import { getSessionSecret } from "./helper";
import { handleResponse } from "../../libs/http";

export const register: RequestHandler = async (req, res) => {
    //generar el token de verificacion
    const code = randomUUID()
    const jwt: string = jwtSignMail({ code })

    //registrar el usuario
    const userSaved = await UserModel.create({ ...req.body, code })

    //mandar correo de activacion
    Mailer.sendMail({
        subject: "Activar cuenta",
        from: `Reportes TIC <${MAILER_CONFIG.auth.user}>`,
        to: userSaved.email,
        html: loadMailTemplate('active-user', {
            name: userSaved.name,
            code: jwt
        })
    })

    return handleResponse(res, {
        success: true,
        message: lang.services.auth.controllers.register
    })
}

export const active: RequestHandler = async (req, res) => {
    const verifyJwtResult = jwtDecodeMail<ActiveMailTokenPayload>(req.query.code as string)

    if( !verifyJwtResult.success ) return handleResponse(res, {
        success: false,
        status: 401,
        message: verifyJwtResult.errorMsg
    })

    const userAccount = await UserModel.findOne({ code: verifyJwtResult.payload?.code })
    
    if( !userAccount ) return handleResponse(res, { 
        success: false,
        message: lang.services.auth.controllers.activeNotFound,
        status: 404,
    })

    userAccount.status = true
    await userAccount.save()
    
    return handleResponse(res, {
        success: true,
        message: lang.services.auth.controllers.activeOk,
        status: 200
    })
}

export const resendCode: RequestHandler = async (req, res) => {
    const userAccount = await UserModel.findOne({email: req.body.email})
    
    if( !userAccount ) return handleResponse(res, {
        success: false,
        message: lang.services.auth.controllers.resendCodeNotFound,
        status: 404,
    })

    const code = randomUUID()
    const jwt: string = jwtSignMail({code})

    userAccount.save()

    Mailer.sendMail({
        subject: "Activar cuenta",
        from: `Reportes TIC <${MAILER_CONFIG.auth.user}>`,
        to: userAccount.email,
        html: loadMailTemplate('active-user', {
            name: userAccount.name,
            code: jwt
        })
    })

    return handleResponse(res,{ success: true, status: 200, message: lang.services.auth.controllers.register })
}

export const login: RequestHandler = async (req, res) => {
    const user = await UserModel.findOne({username: req.body.username}, '+password +sessions')
    
    if( !user ) return handleResponse(res,{
        success: false,
        message: lang.services.auth.controllers.loginInvalidUsername,
        status: 401
    })
    if( !user.checkPassword(req.body.password) ) return handleResponse(res,{
        success: false,
        message: lang.services.auth.controllers.loginInvalidPassword,
        status: 401
    })
    if( !user.status ) return handleResponse(res,{
        success: false,
        message: lang.services.auth.controllers.loginInactiveAccount,
        status: 403
    })

    const { browser, os} = UAParser(req.header('user-agent'))
    const sessionId = randomUUID()
    const sessionSecret = randomBytes(16).toString('base64')
    const sessionName = `${ browser?.name || '' } ${ os?.name || '' } ${ os?.version || '' }`.trim() || lang.services.auth.controllers.loginSessionUnknownDevice
    user.sessions.push( { name: sessionName, sid: sessionId, secret: sessionSecret } )
    await user.save()

    const jwtAccess = jwtSignAccess({username: user.username}, sessionSecret)
    const jwtRefresh = jwtSignRefresh({username: user.username, sid: sessionId})

    res.cookie('refreshToken', jwtRefresh, { httpOnly: true, maxAge: 1024 * 60 * 60 * 24 * 30, signed: true })

    return handleResponse(res, { success: true, data: { accessToken: jwtAccess }, message: lang.services.auth.controllers.loginOk })
}

export const logout: RequestHandler = async (req, res) => {
    const user = req.user as User
    // req.body.accountSid es el id de sesion que se obtiene en el middleware isAuth
    const sid = req.body.accountSid
    const userAccount = await UserModel.findOne({username: user.username}, '+sessions')
    const sessionIndex = userAccount?.sessions.findIndex(session => session.sid == sid)
    if ( sessionIndex != undefined ) {
        userAccount?.sessions.splice(sessionIndex, 1)
        await userAccount?.save()
    }

    res.clearCookie('refreshToken')
    return handleResponse(res, { success: true, message: lang.services.auth.controllers.logoutOk })
}

export const refresh: RequestHandler = async (req, res) => {
    const userAccount = req.user as User
    // req.body.accountSid es el id de sesion que se obtiene en el middleware isAuth
    const secret = getSessionSecret(userAccount, req.body.accountSid) as string
    const accessToken = jwtSignAccess({ username: userAccount.username }, secret)
    return handleResponse(res, { success: true, data: {accessToken} })
}