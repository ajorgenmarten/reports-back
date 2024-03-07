export const DB = process.env.DB
export const PORT = process.env.PORT
export const MODE = process.env.MODE

// Configuracion jsonwebtoken
export const JWT_SECRET_REFRESH=process.env.JWT_SECRET_REFRESH
export const JWT_SECRET_MAIL=process.env.JWT_SECRET_MAIL

// Configuraciones de correo
export const MAIL_HOST = process.env.MAIL_HOST as string
export const MAIL_PORT = parseInt( process.env.MAIL_PORT as string )
export const MAIL_ALL_TSL = process.env.MAIL_ALL_TLS
export const MAIL_USER = process.env.MAIL_USER
export const MAIL_PWD = process.env.MAIL_PWD

const MAILER_BASE_CONFIG = {
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: true,
    auth: {
        user: MAIL_USER,
        pass: MAIL_PWD
    }
}

export const MAILER_CONFIG = {...MAILER_BASE_CONFIG, ... MAIL_ALL_TSL == "true" && { tls: { rejectUnauthorized: false } } }
export const FRONTEND_URL = process.env.FRONTEND_URL as string

export const WEBPUSH_PUBLIC_KEY = process.env.WEBPUSH_PUBLIC_KEY as string
export const WEBPUSH_PRIVATE_KEY = process.env.WEBPUSH_PRIVATE_KEY as string