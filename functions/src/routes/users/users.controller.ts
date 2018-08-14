'use strict';

import { Request, Response } from "express";
import { AuthRequest } from "../../interfaces";
import { FirebaseDAO as firebase} from "../../storage/firebase";

class UsersController {

    async create(req: AuthRequest, res: Response) {
        let user = req.body;
        
        user = await firebase.user.create(user, req.credentials.uid);

        res.json({ user });
    }

    async read(req: AuthRequest, res: Response) {
        const user = await firebase.user.findById(req.credentials.uid);

        res.json(user);
    }

    async update(req: AuthRequest, res: Response) {
        const user = await firebase.user.update(req.body, req.credentials.uid);

        res.json({ data: user })
    }

    async isEmailAvailable(req: Request, res: Response) {
        const email = req.params.email;

        const isAvailable = await firebase.user.isEmailAvailable(email);

        res.status(isAvailable ? 200 : 409).json({ email });
    }
}

function init(): UsersController {
    return new UsersController();
}

export default init;