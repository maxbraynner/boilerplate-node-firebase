'use strict';

import * as admin from "firebase-admin";
import * as Boom from 'boom';
import { NextFunction, Response } from "express";
import { Scope } from "../enums/scope";
import { AuthRequest } from "../interfaces";

class Auth {

    /**
     * 
     * @param scopes if no scope is passed, it will not be validated
     */
    constructor(private scopes?: Scope[]) { }

    /**
     * Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
     * when decoded successfully, the ID Token content will be added as `req.credentials`.
     * @param req 
     * @param res 
     * @param next 
     */
    private async authFirebase(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const { authorization } = req.headers;

            if (!authorization) {
                next(Boom.unauthorized('Token not informed'));
                return;
            }

            const bearer = authorization.split('Bearer ');

            const decodedToken: any = await admin.auth().verifyIdToken((bearer[1] || bearer[0]).trim());

            if (this.scopes.length) {
                this.checkScope(this.scopes, decodedToken.scope);
            }

            req.credentials = decodedToken;

            next();
        } catch (error) {
            next(error.isBoom ? error : Boom.forbidden('invalid token'));
        }
    };

    /**
     * Express middleware for test
     * @param req 
     * @param res 
     * @param next 
     */
    private authTest(req: AuthRequest, res: Response, next: NextFunction) {
        req.credentials = {
            uid: process.env.TEST_USER_UID,
            email: process.env.TEST_USER_EMAIL,
            scope: {
                user: true,
                admin: true
            }
        };

        next();
    }

    /**
     * check if user has scope
     * @param scopes 
     * @param userScope 
     */
    private checkScope(scopes: Scope[], userScope: object) {
        if (!userScope) {
            throw Boom.badRequest('user do not have scope');
        }

        const hasScope = scopes.some((scope) => {
            return userScope[scope] === true;
        });

        if (!hasScope) {
            throw Boom.forbidden('insufficient privileges for this route');
        }
    }

    get config() {
        if (process.env.NODE_ENV === 'test') {
            return this.authTest.bind(this);
        }

        return this.authFirebase.bind(this);
    }

}

/**
 * 
 * @param scopes if no scope is passed, it will not be validated
 */
function init(...scopes: Scope[]) {
    return new Auth(scopes).config;
}

export default init;