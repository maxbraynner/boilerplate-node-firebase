'use strict';

import * as admin from 'firebase-admin';
import enums from "../../../src/enums";
import * as utils from '../../utils';
import * as HTTPStatus from 'http-status';
import * as faker from 'faker';
import 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { QuerySnapshot, DocumentSnapshot } from '@google-cloud/firestore';

const { expect } = chai;
chai.use(chaiHttp);

const base_url = '/users';

const testUser = {
  uid: process.env.TEST_USER_UID,
  email: process.env.TEST_USER_EMAIL,
  name: process.env.TEST_USER_NOME,
};


describe('Users', function () {

  describe('GET /users/email/:email', function () {

    it('expect status CONFLIT(409) due to already existent email', function (done) {
      utils.makeGetCall(`${base_url}/email/${testUser.email}`, {}, {})
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.CONFLICT);
          done();
        })
        .catch(function (error) {
          done(error);
        })
    })

    it('expect return email', function (done) {
      let fakeEmail = 'fakeemail@info.net'
      utils.makeGetCall(`${base_url}/email/${fakeEmail}`, {}, {})
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.OK);
          expect(response.body.email).to.be.equal(fakeEmail);
          done();
        })
        .catch(function (error) {
          done(error);
        })
    })

  }) //describe GET /users/email/:email

  describe('GET /users', function () {

    it('expect return test user', function (done) {
      utils.makeGetCall(base_url)
        .then(function (response: any) {
          let user: any = response.body;
          expect(response).to.have.status(HTTPStatus.OK);
          expect(user.name).to.be.equal(testUser.name);
          done();
        })
        .catch(error => {
          done(error);
        })
    })
  }) //end describe GET /users

  describe('POST /users', function () {

    beforeEach('remove test user', function () {
      const db = admin.firestore();
      return db.doc(`/users/${testUser.uid}`).delete();
    })//end beforeEach

    after('add test user', function () {
      const db = admin.firestore();
      const payload = { name };
      return db.collection('users').doc(testUser.uid).set(payload);
    })

    it('expect create user', function (done) {
      const payload = { name: 'test3' }
      utils.makePostCall(base_url, payload)
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.OK);
          done();
        })
        .catch(error => {
          done(error);
        })
    })

    it('expect BAD_REQUEST due to invalid payload', function (done) {
      const payload = { nome: 'test3' }
      utils.makePostCall(base_url, payload, {})
        .then(function (response: any) {
          expect(response).to.have.status(HTTPStatus.BAD_REQUEST);
          done();
        })
        .catch(error => {
          done(error);
        })
    })

  })//end describe POST /users

  describe('PUT /users', function () {

    after('undo changes in test user', function () {
      const db = admin.firestore();
      const { name } = testUser;
      const payload = { name };
      return db.collection('users').doc(testUser.uid).update(payload);
    })

    it('expect change user', async () => {
      
      const payload = testUser.name
      const response = await utils.makePutCall(base_url, payload);

      expect(response).to.have.status(HTTPStatus.OK);
    })

    it('expect OK(200) but ignore new properties', async () => {
      const payload = { name: 'testando', newProp: 'should_not_save' };
      const response: any = await utils.makePutCall(base_url, payload, {});

      expect(response).to.have.status(HTTPStatus.OK);
      //verificando se o novo campo não foi adicioando
      expect(response.body.data.newProp).to.be.undefined;

    })

  })//end describe PUT /users

}); //describe users




