'use strict';

import * as faker from 'faker';
import * as chai from 'chai';
import 'mocha';
import * as Joi from 'joi';
import { userSchemas } from '../../../src/routes/users/users.validator';


const { expect } = chai;

describe('Validador de user', function () {

    describe('schema create', function () {

        it('should validate', function () {
            let data: any = { nome: faker.name.firstName() }
            let { error } = Joi.validate(data, userSchemas.create);
            expect(error).to.be.null;

            data = { nome: faker.name.firstName() }
            let result = Joi.validate(data, userSchemas.create);
            expect(result.error).to.be.null;
        })

        it('should fail when payload is incomplete', function () {
            let data: any = { }
            let result = Joi.validate(data, userSchemas.create);
            expect(result.error).to.be.not.null;
        })
    })//end describe create

    describe('schema change', function () {

        it('should validate', function () {
            let data = { nome: faker.name.firstName() }
            let { error } = Joi.validate(data, userSchemas.change);
            expect(error).to.be.null;
        })

        it('should fail when payload is incomplete', function () {
            let data: any = {}
            let result = Joi.validate(data, userSchemas.create);
            expect(result.error).to.be.not.null;
        })

    })//end describe change

})