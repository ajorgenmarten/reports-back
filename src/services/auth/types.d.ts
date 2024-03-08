import { Request } from 'express'
import { ObjectId } from 'mongoose'
export interface User {
    _id: ObjectId
    name: string
    email: string
    username: string
    password: string
    code: string
    status: boolean
    sessions: Session[]
    role: "user" | "admin"
    checkPassword: (password: string) => boolean
}

export type Session = {
    sid: string
    name: string
    secret: string
}

export type ActiveMailTokenPayload = {
    code: string
}

export type RefreshTokenPayload = {
    username: string,
    sid: string
}

export type AccessTokenPayload = {
    username: string
}