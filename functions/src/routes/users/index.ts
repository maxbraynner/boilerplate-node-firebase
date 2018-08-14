'use strict';

import { Router } from "express";

import { AuthRequest } from "../../interfaces";
import { Scope } from "../../enums/scope";
import UserValidator from "./users.validator"
import UserController from "./users.controller"
import Auth from "../auth"


const router = Router();

/**
 * restrict routers
 */

// this endpoint do not need a scope
router.post('/', UserValidator().create(), Auth(),
    (req: AuthRequest, res, next) => {
        UserController().create(req, res).catch(next);
    });

router.get('/', Auth(Scope.USER),
    (req: AuthRequest, res, next) => {
        UserController().read(req, res).catch(next);
    });

router.put('/', UserValidator().change(), Auth(Scope.USER),
    (req: AuthRequest, res, next) => {
        UserController().update(req, res).catch(next);
    });

/**
 * public routers
 */
router.get('/email/:email',
    (req, res, next) => {
        UserController().isEmailAvailable(req, res).catch(next);
    });

export default router;