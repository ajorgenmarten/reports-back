import jsonwebtoken from 'jsonwebtoken'

import { JWT_SECRET_MAIL, JWT_SECRET_REFRESH } from '../config'
import lang from '../lang'

type jwtDecodedResult<T = any> = {
    success: boolean,
    payload?: T,
    errorMsg?: string
}

export const jwtSignRefresh = (payload: any) => jsonwebtoken.sign(payload, JWT_SECRET_REFRESH as string, { expiresIn: '30 days' })

export const jwtSignAccess = (payload: any, secret: string) => jsonwebtoken.sign(payload, secret, { expiresIn: '15m' })

export const jwtSignMail = (payload: any) => jsonwebtoken.sign(payload, JWT_SECRET_MAIL as string, {expiresIn: '30 days'})

export function jwtDecodeMail<T = any> (token: string)  { return jwtBaseDecode<T>(token, JWT_SECRET_MAIL as string) }

export function jwtDecodeAccess<T = any> (token: string, secret: string) { return jwtBaseDecode<T>(token, secret) }

export function jwtDecodeRefresh<T = any> (token: string) { return jwtBaseDecode<T>(token, JWT_SECRET_REFRESH as string) }

function jwtBaseDecode<T> (token: string, secret: string): jwtDecodedResult<T>  {
    try {
        const payload = jsonwebtoken.verify(token, secret)
        return {
            success: true,
            payload: payload as T
        }
    } catch (error: any) {
        switch (error.message) {
            case "jwt expired":
                return {
                    success: false,
                    errorMsg: lang.libs.jsonwebtoken.expired
                }
            
            case "invalid signature":
                return {
                    success: false,
                    errorMsg: lang.libs.jsonwebtoken.invalidSignature
                }
            
            case "invalid token":
                return {
                    success: false,
                    errorMsg: lang.libs.jsonwebtoken.invalidToken
                }
        
            default:
                return {
                    success: false,
                    errorMsg: error.message
                }
        }
    }
}