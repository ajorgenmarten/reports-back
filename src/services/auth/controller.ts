import { RequestHandler } from "express";
import { randomUUID } from 'crypto'

import { jwtDecodeMail, jwtSignAccess, jwtSignMail, jwtSignRefresh } from "../../libs/jsonwebtoken";
import { loadMailTemplate, Mailer } from "../../libs/mailer";

import { UserModel } from "./models";
import { ActivePayload } from "./types";

import { MAILER_CONFIG } from "../../config";
import lang from "../../lang";

export const register: RequestHandler = async (req, res) => {
    //generamos el token de verificacion
    const code = randomUUID()
    const jwt: string = jwtSignMail({ code })

    //registramos el usuario
    const userSaved = await UserModel.create({ ...req.body, code })

    //mandamos correo de activacion
    Mailer.sendMail({
        subject: "Activar cuenta",
        from: `Reportes TIC <${MAILER_CONFIG.auth.user}>`,
        to: userSaved.email,
        html: loadMailTemplate('active-user', {
            name: userSaved.name,
            code: jwt
        })
    })

    res.json({ success: true, status: 200, message: undefined, data: lang.services.auth.controllers.register })
}

export const active: RequestHandler = async (req, res) => {
    const verifyJwtResult = jwtDecodeMail<ActivePayload>(req.query.code as string)

    if( !verifyJwtResult.success ) return res.status(401).json({
        success: false,
        data: undefined,
        status: 401,
        message: verifyJwtResult.errorMsg
    })

    const userAccount = await UserModel.findOne({ code: verifyJwtResult.payload?.code })
    
    if( !userAccount ) return res.status(404).json({ 
        success: false,
        data: undefined,
        message: lang.services.auth.controllers.activeNotFound,
        status: 404,
    })

    userAccount.status = true
    await userAccount.save()
    
    return res.status(200).json({
        success: true,
        message: lang.services.auth.controllers.activeOk,
        status: 200,
        data: undefined
    })
}

export const resendCode: RequestHandler = async (req, res) => {
    const userAccount = await UserModel.findOne({email: req.body.email})
    
    if( !userAccount ) return res.status(404).json({
        success: false,
        message: lang.services.auth.controllers.resendCodeNotFound,
        data: undefined,
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

    res.json({ success: true, status: 200, message: undefined, data: lang.services.auth.controllers.register })
}

export const login: RequestHandler = async (req, res) => {
    const user = await UserModel.findOne({username: req.body.username})
    if( !user ) return res.status(401).json({
        success: false,
        message: lang.services.auth.controllers.loginInvalidUsername,
        data: undefined,
        status: 401
    })
    if( !user.checkPassword(req.body.password) ) return res.status(401).json({
        success: false,
        message: lang.services.auth.controllers.loginInvalidPassword,
        data: undefined,
        status: 401
    })
    if( !user.status ) return res.status(403).json({
        success: false,
        data: undefined,
        message: lang.services.auth.controllers.loginInactiveAccount,
        status: 403
    })

    const jwtAccess = jwtSignAccess({username: user.username})
    const jwtRefresh = jwtSignRefresh({username: user.username})

    res.cookie('refreshToken', jwtRefresh, { httpOnly: true, maxAge: 1024 * 60 * 60 * 24 * 30 })

    return res.json({
        success: true,
        data: { accessToken: jwtAccess },
        status: 200,
        message: lang.services.auth.controllers.loginOk,
    })
}