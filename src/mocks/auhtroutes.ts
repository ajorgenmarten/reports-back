import { User } from "../services/auth/types"

export default [
] as AuthRouteDef[]

interface AuthRouteDef {
    path: string
    roles: User['role'][]
} 