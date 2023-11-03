type SERVER = "THABA" | "INTERNET"

export const SERVER = process.env.SERVER as SERVER
export const DB = process.env.DB
export const PORT = process.env.PORT

// Configuracion jsonwebtoken
export const JWT_SECRET_REFRESH=process.env.JWT_SECRET_REFRESH
export const JWT_SECRET_ACCESS=process.env.JWT_SECRET_ACCESS
export const JWT_SECRET_MAIL=process.env.JWT_SECRET_MAIL

// Configuracion de cookie-parser
export const COOKIE_PARSER_SECRET=process.env.COOKIE_PARSER_SECRET

// Configuraciones de correo
export const MAIL_FROM_INERTNET = process.env.GOOGLE_EMAIL
export const MAIL_FROM_THABA = process.env.THABA_EMAIL
export const GOOGLE_APIKEY = process.env.GOOGLE_APIKEY
export const THABA_PASSWORD = process.env.THABA_PASSWORD
export const MODE = process.env.MODE

const MAILER_BASE_CONFIG = {
    host: SERVER == "THABA" ? "correo.thaba.cu" : "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: SERVER == "THABA" ? MAIL_FROM_THABA : MAIL_FROM_INERTNET,
        pass: SERVER == "THABA" ? THABA_PASSWORD : GOOGLE_APIKEY
    }
}

export const MAILER_CONFIG = {...MAILER_BASE_CONFIG, ... SERVER == "THABA" && { tls: { rejectUnauthorized: false } } }
