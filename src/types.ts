import { User } from "./services/auth/types";

declare module 'express-serve-static-core' {
    interface Request {
        isAuth: boolean
        user?: User
        session?: string
    }
}