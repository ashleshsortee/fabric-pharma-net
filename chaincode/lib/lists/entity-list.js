'use strict';

const Entity = require('../models/entity');
const { iterateResult } = require('../utils');

class EntityList {
  constructor(ctx) {
    this.ctx = ctx;
    this.name = `org.pharma-network.pharmanet.lists.entity`;
  }

  // Add entity model to the ledger
  async addEntity(requestObj) {
    const entityCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestObj.getKeyArray());
    const requestBuffer = requestObj.toBuffer();
    await this.ctx.stub.putState(entityCompositeKey, requestBuffer);
  }

  // Fetch entity model from the ledger
  async getEntity(entityKey) {
    const entityCompositeKey = this.ctx.stub.createCompositeKey(this.name, entityKey.split(':'));
    const entityBuffer = await this.ctx.stub.getState(entityCompositeKey);
    return Entity.fromBuffer(entityBuffer);
  }

  // Fetch entity model by CRN
  async getEntityByCRN(entityKey) {
    try {
      const entityIterator = await this.ctx.stub.getStateByPartialCompositeKey(this.name, entityKey.split(':'));
      const entityBuffer = await iterateResult(entityIterator);

      return Entity.fromBuffer(entityBuffer);
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = EntityList;
