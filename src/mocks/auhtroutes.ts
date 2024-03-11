import { User } from "../services/auth/types"

export default [
    { path: '/reports/all', roles: ['admin'] },
] as AuthRouteDef[]

interface AuthRouteDef {
    path: string
    roles: User['role'][]
} 