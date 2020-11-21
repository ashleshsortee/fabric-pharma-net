'use strict';

const Drug = require('../models/drug');
const { iterateResultBulk, iterateDrugAudit } = require('../utils');

class DrugList {
  constructor(ctx) {
    this.ctx = ctx;
    this.name = `org.pharma-network.pharmanet.lists.drug`;
  }

  // Adds a drug model to the ledger
  async addDrug(requestObj) {
    const drugCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestObj.getKeyArray());
    const requestBuffer = requestObj.toBuffer();
    await this.ctx.stub.putState(drugCompositeKey, requestBuffer);
  }

  // Get drug model from the ledger
  async getDrug(drugKey) {
    const drugCompositeKey = this.ctx.stub.createCompositeKey(this.name, drugKey.split(':'));
    const drugBuffer = await this.ctx.stub.getState(drugCompositeKey);
    return Drug.fromBuffer(drugBuffer);
  }

  // Get all drug models by the drug name
  async getDrugByName(drugKey) {
    try {
      const drugIterator = await this.ctx.stub.getStateByPartialCompositeKey(this.name, drugKey.split(':'));
      const drugResult = await iterateResultBulk(drugIterator);

      return drugResult;
    } catch (err) {
      throw new Error(err);
    }
  }

  // Get audit history of a drug
  async getDrugAudit(drugKey) {
    try {
      const drugCompositeKey = this.ctx.stub.createCompositeKey(this.name, drugKey.split(':'));
      const drugAuditIterator = await this.ctx.stub.getHistoryForKey(drugCompositeKey);
      const auditResult = await iterateDrugAudit(drugAuditIterator, true);
      return auditResult;
    } catch (err) {
      console.log('console error ', err);
    }
  }
}

module.exports = DrugList;
