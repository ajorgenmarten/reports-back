import { User } from "./types";

export const getSessionSecret = (user: User, sid: string) => user.sessions.find(session => session.sid == sid)?.secret