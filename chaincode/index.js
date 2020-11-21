'use strict';

const Registration = require('./contracts/registration-contract');
const Transfer = require('./contracts/transfer-contract');
const Lifecycle = require('./contracts/lifecycle-contract');
// const RegistrarContract = require('./registar-contract');

module.exports.contracts = [Registration, Transfer, Lifecycle];