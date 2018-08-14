'use strict';

import * as dotenv from 'dotenv';
dotenv.config();

import * as admin from 'firebase-admin';

class ConfigFirebase {

    initializeApp(){        
        admin.initializeApp({
            credential: admin.credential.cert({
                clientEmail: process.env.CLIENT_EMAIL,
                privateKey: JSON.parse(`"${process.env.PRIVATE_KEY}"`),
                projectId: process.env.PROJECT_ID,
            }),
            databaseURL: process.env.DATABASE_URL,
            storageBucket: process.env.STORAGE_BUCKET
        });

        console.log("Firebase initialized");
    }

    initializeFunction(functions) {
        admin.initializeApp(functions.config().firebase);
 
        console.log("Functions initialized");
    }

}

export const config = new ConfigFirebase();
