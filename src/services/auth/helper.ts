import { User } from "./types";

/**
 * @param user Objeto de usuario
 * @param sid id de la sesion actual
 * @returns {string} Secreto con el que se firma el token de acceso
 */
export const getSessionSecret = (user: User, sid: string) => user.sessions.find(session => session.sid == sid)?.secret

export const cleanAccessToken = (token?: string) => {
    if (!token) return false
    if (!/^Bearer /.test(token)) return false
    return token.replace('Bearer ', '')
}