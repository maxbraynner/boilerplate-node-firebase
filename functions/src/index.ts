'use strict';

import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

import app from './app';

/**
 * API
 */
export const api = functions.https.onRequest(app);

/**
 * Trigger que incrementa o contador de fichas por usuário
 */
export const count = functions.firestore
    .document('fichas/{fichaId}').onCreate((snap, context) => {
        const db = admin.firestore();

        const ficha = snap.data();
        const medicoRef = db.doc(`users/${ficha.medico}`);

        return db.runTransaction(async (transaction) => {
            const docMedico = await transaction.get(medicoRef);
            const qtdFichas = (docMedico.data().qtdFichas || 0) + 1;

            transaction
                .update(medicoRef, { qtdFichas: qtdFichas })
                .update(snap.ref, { numero: qtdFichas });
        })
    })