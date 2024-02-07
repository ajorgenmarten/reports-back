import { RequestHandler } from "express";
import { UAParser } from 'ua-parser-js'
import { randomUUID, randomBytes } from 'crypto'

import { jwtDecodeMail, jwtSignAccess, jwtSignMail, jwtSignRefresh } from "../../libs/jsonwebtoken";
import { isReady, loadMailTemplate, Mailer } from "../../libs/mailer";

import { UserModel } from "./models";
import { getSessionSecret } from "./helper";
import { ActiveMailTokenPayload, RefreshTokenPayload, User } from "./types";

import { MAILER_CONFIG, FRONTEND_URL } from "../../config";
import lang from "../../lang";
import { handleResponse } from "../../libs/http";

export const register: RequestHandler = async (req, res) => {
    const mailVerify = await isReady()
    if(!mailVerify) return handleResponse(res, {
        success:  false,
        message: lang.services.auth.controllers.registerMailError,
        status: 500
    })

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
            code: jwt,
            "front-url": FRONTEND_URL
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
    userAccount.code = randomUUID()
    await userAccount.save()
    
    return handleResponse(res, {
        success: true,
        message: lang.services.auth.controllers.activeOk,
        status: 200
    })
}

export const resendCode: RequestHandler = async (req, res) => {
    const userAccount = await UserModel.findOne({username: req.body.username})
    
    if( !userAccount ) return handleResponse(res, {
        success: false,
        message: lang.services.auth.controllers.resendCodeNotFound,
        status: 404,
    })

    const code = randomUUID()
    const jwt: string = jwtSignMail({code})

    userAccount.code = code
    userAccount.save()

    Mailer.sendMail({
        subject: "Activar cuenta",
        from: `Reportes TIC <${MAILER_CONFIG.auth.user}>`,
        to: userAccount.email,
        html: loadMailTemplate('active-user', {
            name: userAccount.name,
            code: jwt,
            "front-url": FRONTEND_URL
        })
    })

    return handleResponse(res,{ success: true, status: 200, message: lang.services.auth.controllers.register })
}

export const login: RequestHandler = async (req, res) => {
    const user = await UserModel.findOne({ $or:[{username: req.body.username}, {email:req.body.email}]}, '+password +sessions')
    
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

    res.cookie('refreshToken', jwtRefresh, { maxAge: 1024 * 60 * 60 * 24 * 30, httpOnly: true })

    return handleResponse(res, { success: true, data: { accessToken: jwtAccess }, message: lang.services.auth.controllers.loginOk })
}

export const logout: RequestHandler = async (req, res) => {
    const user = req.user as User
    // req.session es el id de sesion que se obtiene en el middleware isAuth
    const sid = req.session
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

export const forgot: RequestHandler = async (req, res) => {
    const username = req.body.username
    const user = await UserModel.findOne({ $or: [ { username }, { email: username } ] }, "+code")
    if ( !user ) return handleResponse(res, {
        success: false,
        message: lang.services.auth.controllers.forgotNotExistAccount
    })
    
    const code = randomUUID()
    const jwt: string = jwtSignMail({ code })

    user.code = code
    Mailer.sendMail({
        subject: "Cambiar contraseña",
        from: `Reportes TIC <${MAILER_CONFIG.auth.user}>`,
        to: user.email,
        html: loadMailTemplate('change-password', {
            name: user.name,
            code: jwt,
            "front-url": FRONTEND_URL
        })
    })
    user.save()
    return handleResponse( res, {
        success: true,
        message: lang.services.auth.controllers.forgotOk
    })
}

export const changePassword: RequestHandler = async (req, res) => {
    const jwtVerify = jwtDecodeMail<ActiveMailTokenPayload>(req.body.code)
    if ( !jwtVerify.success ) return handleResponse(res, {
        success: false,
        status: 403,
        message: jwtVerify.errorMsg
    })

    const userAccount = await UserModel.findOne({ code: jwtVerify.payload?.code })
    
    if( !userAccount ) return handleResponse(res, { 
        success: false,
        message: lang.services.auth.controllers.activeNotFound,
        status: 404,
    })

    if(!userAccount.status) return handleResponse(res, {
        success: false,
        message: lang.services.auth.controllers.loginInactiveAccount,
        data: { username: userAccount.username },
        status: 403
    })

    userAccount.password = req.body.password
    userAccount.code = randomUUID()
    await userAccount.save()
    
    return handleResponse(res, {
        success: true,
        message: lang.services.auth.controllers.changePassword,
        status: 200
    })
}