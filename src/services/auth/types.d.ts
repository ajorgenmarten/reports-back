export interface User {
    name: string
    email: string
    username: string
    password: string
    code: string
    status: boolean
    sessions: Session[]
    checkPassword: (password: string) => boolean
}

export type Session = {
    sid: string
    name: string
}

export type ActiveMailTokenPayload = {
    code: string
}

export type RefreshTokenPayload = {
    username: string,
    sid: string
}