'use strict';

import * as admin from "firebase-admin";
import * as Boom from 'boom';
import { User } from "../../../interfaces";
import { DAO } from "./dao";

export class UserDAO extends DAO {
    constructor() {
        super('users');
    }

    async create(user: User, uid: string) {
        const usersRef = this.ref();

        // remove mascara do cpf
        user.cpf = user.cpf.replace(/\D/g, '');

        await usersRef.doc(uid).set(user)

        return { ...user, id: uid } as User;
    }

    async update(user: User, uid: string) {
        const usersRef = this.ref();

        const newUser = {
            name: user.name,
        };

        try {
            await usersRef.doc(uid).update(newUser);
            return { ...newUser, id: uid };
        } catch (error) {
            throw Boom.notFound('user not found');
        }
    }

    async isEmailAvailable(email: string) {
        try {
            await admin.auth().getUserByEmail(email)

            return false;
        } catch (error) {
            switch (error.code) {
                case 'auth/user-not-found':
                    return true;
                    break;
                case 'auth/invalid-email':
                    return false;
                    break;
                default:
                    throw error;
                    break;
            }
        }
    }
}

function init() {
    return new UserDAO();
}

export default init;