'use strict';

const { Contract, Context } = require('fabric-contract-api');
const Entity = require('../lib/models/entity');
const Drug = require('../lib/models/drug');
const EntityList = require('../lib/lists/entity-list');
const DrugList = require('../lib/lists/drug-list');
const { getEntityHirarchy } = require('../lib/utils');

class PharmanetContext extends Context {
  constructor() {
    super();
    this.entityList = new EntityList(this);
    this.drugList = new DrugList(this);
  }
}

class Registration extends Contract {
  constructor() {
    // A custom name to refer to this smart contract
    super('org.pharma-network.pharmanet.registration');
  }

  // Built in method used to build and return the context for this smart contract on every transaction invoke
  createContext() {
    return new PharmanetContext();
  }

  // A basic user defined function used at the time of instantiating the smart contract
  async instantiate(ctx) {
    console.log('Registration Smart Contract Instantiated');
  }

  /**
   * Register a company in a network
   * @param ctx - The transaction context object
   * @param companyCRN - CRN of a company
   * @param companyName - Name of the company
   * @param location - Location of the company
   * @param organisationRole - Org role of a company
   * @returns {Object}
   */
  async registerCompany(ctx, companyCRN, companyName, location, organisationRole) {
    if (ctx.clientIdentity.getMSPID() === 'consumerMSP')
      throw new Error('Requestor is not allowed to perform this action');

    // Validate if the company is already registered
    const entityKey = Entity.createKey([companyCRN, companyName]);
    const existingEntity = await ctx.entityList
      .getEntity(entityKey)
      .catch(() => console.log(`Creating new entity - ${companyName}...`));

    if (existingEntity)
      throw new Error(`Failed to create entity as entity ${companyName} already exists.`);

    const entityRegObj = {
      companyId: entityKey,
      companyName,
      companyCRN,
      location,
      organisationRole,
      hierarchyKey: getEntityHirarchy(organisationRole),
    }

    // Create a new instance of entity model and save it to ledger
    const newEntityRegObj = Entity.createInstance(entityRegObj);
    delete newEntityRegObj.companyCRN;
    await ctx.entityList.addEntity(newEntityRegObj);
    return newEntityRegObj;
  }

  /**
   * Register a drug on the network
   * @param ctx - The transaction context object
   * @param drugName - Name of a drug
   * @param serialNo - Serial number of a drug
   * @param mfgDate - Manufacturing date of a drug
   * @param expDate - Expiry date of a drug
   * @param companyCRN - CRN of a company 
   * @returns {Object}
   */
  async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN) {
    // Validate if the organisation is manufacture
    if (ctx.clientIdentity.getMSPID() !== 'manufacturerMSP')
      throw new Error('Requestor is not allowed to perform this action');

    const drugKey = Drug.createKey([drugName, serialNo]);
    const manufacturerKey = Entity.createKey([companyCRN]);

    // Fetch the manufacture company details
    const { companyId: manufacturerId } = await ctx.entityList
      .getEntityByCRN(manufacturerKey)
      .catch(err => { throw new Error(err) });

    // Validate if the same drug exists
    const existingDrug = await ctx.drugList
      .getDrug(drugKey)
      .catch(() => console.log(`Creating new drug - ${drugName}...`));

    if (existingDrug)
      throw new Error(`Failed to create drug as drug ${drugName} already exists.`);

    const drugRegObj = {
      productId: drugKey,
      serialNo,
      name: drugName,
      manufacturer: manufacturerId,
      manufacturingDate: mfgDate,
      expiryDate: expDate,
      owner: manufacturerId,
      shipment: new Array(),
    };

    // Create a new instance of drug model and save it to ledger
    const newDrugRegObj = Drug.createInstance(drugRegObj);
    delete newDrugRegObj.serialNo;
    await ctx.drugList.addDrug(newDrugRegObj);
    return newDrugRegObj;
  }
}

module.exports = Registration;