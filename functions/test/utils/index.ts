'use strict';

import * as faker from 'faker';
import enums from "../../src/enums";
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import * as dotenv from 'dotenv';

dotenv.config();

const server = `http://localhost:${process.env.PORT || 3000}`;
chai.use(chaiHttp);


export const makePostCall = function (url, payload, header = {}) {
    return new Promise((resolve, reject) => {
        try {
            chai
                .request(server)
                .post(url)
                .set(header)
                .send(payload)
                .end(function (error, response) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
        } catch (error) {
            console.log(`error: ${error} - ${header}`);
            reject(error);
        }
    });
};

export const makePutCall = function (url, payload, header = {}) {
    return new Promise((resolve, reject) => {
        try {
            chai
                .request(server)
                .put(url)
                .set(header)
                .send(payload)
                .end(function (error, response) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
        } catch (error) {
            console.log(`error: ${error} - ${header}`);
            reject(error);
        }
    });
};

export const makeGetCall = function (url, query = {}, header = {}) {
    return new Promise((resolve, reject) => {
        try {
            chai
                .request(server)
                .get(url)
                .query(query)
                .set(header)
                .end(function (error, response) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
        } catch (error) {
            console.log(`error: ${error} - ${header}`);
            reject(error);
        }
    });
};

export const makeDelCall = function (url, payload = {}, header = {}) {
    return new Promise((resolve, reject) => {
        try {
            chai
                .request(server)
                .del(url)
                .set(header)
                .send(payload)
                .end(function (error, response) {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        resolve(response);
                    }
                });
        } catch (error) {
            console.log(`error: ${error} - ${header}`);
            reject(error);
        }
    });
};

// apaga uma coleção de acordo com a query
export async function deleteCollectionBatch(db, query, resolve, reject) {

    try {
        const snapshot = await query.get();

        // When there are no documents left, we are done
        if (snapshot.size == 0) {
            return 0;
        }

        // Delete documents in a batch
        var batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        if (snapshot.size === 0) {
            resolve();
            return;
        }

        // Recurse on the next process tick, to avoid exploding the stack.
        process.nextTick(() => {
            deleteCollectionBatch(db, query, resolve, reject);
        });
    } catch (e) {
        reject(e);
    }

}
