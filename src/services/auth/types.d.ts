export interface User {
    name: string
    email: string
    username: string
    password: string
    code: string
    status: boolean
    checkPassword: (password: string) => boolean
}

export type ActivePayload = {
    code: string
}