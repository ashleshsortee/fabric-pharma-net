'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Drug = require('../lib/models/drug');
const DrugList = require('../lib/lists/drug-list');

class PharmanetContext extends Context {
  constructor() {
    super();
    this.drugList = new DrugList(this);
  }
}

class Lifecycle extends Contract {
  constructor() {
    // A custom name to refer to this smart contract
    super('org.pharma-network.pharmanet.lifecycle');
  }

  // Built in method used to build and return the context for this smart contract on every transaction invoke
  createContext() {
    return new PharmanetContext();
  }

  // A basic user defined function used at the time of instantiating the smart contract
  async instantiate(ctx) {
    console.log('Lifecycle Smart Contract Instantiated');
  }

  /**
   * View history of a drug
   * @param ctx - The transaction context object
   * @param drugName - Name of the drug
   * @param serialNo - Serial number of a drug
   * @returns {Object}
   */
  async viewHistory(ctx, drugName, serialNo) {
    const drugKey = Drug.createKey([drugName, serialNo]);
    const response = await ctx.drugList.getDrugAudit(drugKey);

    return response;
  }

  /**
   * View current state of a drug
   * @param ctx - The transaction context object
   * @param drugName - Name of the drug
   * @param serialNo - Serial number of a drug
   * @returns {Object}
   */
  async viewDrugCurrentState(ctx, drugName, serialNo) {
    const drugKey = Drug.createKey([drugName, serialNo]);
    const response = await ctx.drugList
      .getDrug(drugKey)
      .catch(err => { throw new Error('Failed to fetch the drug', err) });

    return response;
  }

}

module.exports = Lifecycle;