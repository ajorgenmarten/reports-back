import { User } from "./services/auth/types";

declare module 'express-serve-static-core' {
    interface Request {
        user?: User
        session?: string
    }
}