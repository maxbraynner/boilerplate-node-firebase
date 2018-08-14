import { Request } from "express";

interface AuthRequest extends Request {
    credentials: {
        uid: string,
        email: string
        scope: {
            user: boolean
            admin: boolean
        }
    }
}

export default AuthRequest;