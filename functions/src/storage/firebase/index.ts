'use strict';

import { config } from "./config";
import { UserDAO } from './dao/user.dao'

/**
 * Initialize firebase
 */
config.initializeApp();

export class FirebaseDAO {

    static get user(){
        return new UserDAO();
    }
    
}