import { User } from "../services/auth/types"

export default [
    { path: '/reports/all', roles: ['admin'] },
    { path: '/reports/solution', roles: ['admin'] },
] as AuthRouteDef[]

interface AuthRouteDef {
    path: string
    roles: User['role'][]
} 