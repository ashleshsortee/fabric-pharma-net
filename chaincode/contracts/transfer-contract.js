'use strict';

const { Contract, Context } = require('fabric-contract-api');
const PurchaseOrder = require('../lib/models/purchase-order');
const Entity = require('../lib/models/entity');
const Shipment = require('../lib/models/shipment');
const Drug = require('../lib/models/drug');
const PurchaseOrderList = require('../lib/lists/purchase-order-list');
const EntityList = require('../lib/lists/entity-list');
const ShipmentList = require('../lib/lists/shipment-list');
const DrugList = require('../lib/lists/drug-list');

class PharmanetContext extends Context {
  constructor() {
    super();
    this.purchaseOrderList = new PurchaseOrderList(this);
    this.entityList = new EntityList(this);
    this.shipmentList = new ShipmentList(this);
    this.drugList = new DrugList(this);
  }
}

class Transfer extends Contract {
  constructor() {
    // A custom name to refer to this smart contract
    super('org.pharma-network.pharmanet.transfer');
  }

  // Built in method used to build and return the context for this smart contract on every transaction invoke
  createContext() {
    return new PharmanetContext();
  }

  // A basic user defined function used at the time of instantiating the smart contract
  async instantiate(ctx) {
    console.log('Transfer Smart Contract Instantiated');
  }

  /**
   * Create a purchase order for a drug
   * @param ctx - The transaction context object
   * @param buyerCRN - CRN of a buyer company
   * @param sellerCRN - CRN of a seller company
   * @param drugName - Name of the drug
   * @param quantity - Quantity of a drug
   * @returns {Object}
   */
  async createPO(ctx, buyerCRN, sellerCRN, drugName, quantity) {
    // Validate if the initiator is either a distributor or a retailer
    if (!['distributorMSP', 'retailerMSP'].includes(ctx.clientIdentity.getMSPID()))
      throw new Error('Requestor is not allowed to perform this action');

    const purchaseOrderKey = PurchaseOrder.createKey([buyerCRN, drugName]);
    const buyerKey = Entity.createKey([buyerCRN]);
    const sellerKey = Entity.createKey([sellerCRN]);

    // Fetch buyer company's details
    const { companyId: buyerId, hierarchyKey: buyerHierarchy, organisationRole: buyerRole } = await ctx.entityList
      .getEntityByCRN(buyerKey)
      .catch(err => { throw new Error('Unable to fetch buyer details', err) });

    // Fetch seller company's details
    const { companyId: sellerId, hierarchyKey: sellerHierarchy, organisationRole: sellerRole } = await ctx.entityList
      .getEntityByCRN(sellerKey)
      .catch(err => { throw new Error('Unable to fetch seller details', err) });


    // Validate if the buyer organisation is authorized to purchase from the seller organisation
    if (sellerHierarchy !== buyerHierarchy - 1)
      throw Error(`${buyerRole} is not allowed to purchase directly from ${sellerRole}`);

    const purchaseOrderObj = {
      poId: purchaseOrderKey,
      drugName,
      quantity,
      buyer: buyerId,
      seller: sellerId,
      buyerCRN,
    };

    // Create a new instance of purchase order model and save it to ledger
    const newPurchaseOrderObj = PurchaseOrder.createInstance(purchaseOrderObj);
    delete newPurchaseOrderObj.buyerCRN;
    await ctx.purchaseOrderList.addPurchaseOrder(newPurchaseOrderObj);
    return newPurchaseOrderObj;
  }

  /**
   * Create a shipment of a drug
   * @param ctx - The transaction context object
   * @param buyerCRN - CRN of a buyer company
   * @param drugName - Name of the drug
   * @param listOfAssets - List of drug ids
   * @param transporterCRN - CRN of a transportation company
   * @returns {Object}
   */
  async createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterCRN) {
    // Valitate if the initiator is either a manufacturer or a distributor
    if (!['manufacturerMSP', 'distributorMSP'].includes(ctx.clientIdentity.getMSPID()))
      throw new Error('Requestor is not allowed to perform this action');

    const shipmentKey = Shipment.createKey([buyerCRN, drugName]);
    const drugList = listOfAssets.split(',');

    // Fetch a purchase order details
    const purchaseOrderKey = PurchaseOrder.createKey([buyerCRN, drugName]);
    const { seller: sellerId, quantity: poQuantity } = await ctx.purchaseOrderList
      .getPurchaseOrder(purchaseOrderKey)
      .catch(err => { throw new Error('Unable to fetch purchase order details', err); });

    // Fetch a transportation company's details
    const transporterKey = Entity.createKey([transporterCRN]);
    const { companyId: transporterId } = await ctx.entityList
      .getEntityByCRN(transporterKey)
      .catch(err => { throw new Error('Unable to fetch the transporter details', err); });

    // Fetch a buyer company's details
    const buyerKey = Entity.createKey([buyerCRN]);
    const { companyId: buyerId } = await ctx.entityList
      .getEntityByCRN(buyerKey)
      .catch(err => { throw new Error('Unable to fetch the buyer details', err); });

    // Validate if the purchare order quantity is same as shipment quantity
    if (parseInt(poQuantity) !== drugList.length)
      throw new Error('Failed! Purchase order quantity does not match with the shipment quantity');

    // Fetch drug detail by its name
    const drugKey = Drug.createKey([drugName]);
    const drugs = await ctx.drugList
      .getDrugByName(drugKey)
      .catch(err => { throw new Error(`Unable to fetch drug by name`, err) });

    // Validate if the drug in a shipment is valid drug registered on a network
    const drugAssetIds = drugs.map(drug => drug.productId);
    drugList.map(drugId => {
      if (!drugAssetIds.includes(drugId)) {
        throw new Error(`Drug ${drugId} in the shipment list is not registered in the drug list`);
      }
    });

    // Update the drug's owner for the list of drugs in a shipment
    await Promise.all(drugs.map(async drugObj => {
      const { productId } = drugObj;
      if (drugList.includes(productId)) {
        const updatedDrugObj = Object.assign({}, drugObj, { owner: buyerId });
        const newDrugObj = Drug.createInstance(updatedDrugObj);
        await ctx.drugList.addDrug(newDrugObj);
        console.log(`Owner updated for drug ${drugObj.productId}`);
      }
    }));

    const shipmentObj = {
      shipmentID: shipmentKey,
      creator: sellerId,
      assets: drugList,
      transporter: transporterId,
      status: 'in-transit',
      buyerCRN,
      drugName,
    };

    // Create a new instance of shipment model and save it to ledger
    const newShipmentObj = Shipment.createInstance(shipmentObj);
    delete newShipmentObj.buyerCRN;
    delete newShipmentObj.drugName;
    await ctx.shipmentList.addShipment(newShipmentObj);
    return newShipmentObj;
  }

  /**
   * Update shipment order
   * @param ctx - The transaction context object
   * @param buyerCRN - CRN of a buyer company
   * @param drugName - Name of the drug
   * @param transporterCRN - CRN of a transportation company
   * @returns {Object}
   */
  async updateShipment(ctx, buyerCRN, drugName, transporterCRN) {
    // Fetch the shipment details
    const shipmentKey = Shipment.createKey([buyerCRN, drugName]);
    const shipmentDetails = await ctx.shipmentList
      .getShipment(shipmentKey)
      .catch(err => { throw new Error(`Failed to fetch the shipment details ${shipmentKey}`) });
    const { assets: drugList, transporter } = shipmentDetails;

    // Validate if the transporter is the one mentioned in the shipment
    if (transporter.split(':')[0] !== transporterCRN)
      throw new Error('Requestor is not allowed to perform this action');

    // Update the shipment with the status as delivered
    const newShipmentObj = Shipment.createInstance(Object.assign({}, shipmentDetails, { status: 'delivered', buyerCRN, drugName }));
    delete newShipmentObj.buyerCRN;
    delete newShipmentObj.drugName;
    await ctx.shipmentList.addShipment(newShipmentObj);
    console.log(`Drug ${drugName} shipment is delivered to ${buyerCRN} and status is updated!`);

    // Fetch all the drugs by name
    const drugKey = Drug.createKey([drugName]);
    const drugs = await ctx.drugList
      .getDrugByName(drugKey)
      .catch(err => { throw new Error(`Unable to fetch drug by name`, err) });

    // Update the shipment property of the drug asset present in the shipment list
    await Promise.all(drugs.map(async drugObj => {
      const productId = drugObj.productId;

      if (drugList.includes(productId)) {
        const serialNo = productId.split(':')[1];
        drugObj.shipment.push(shipmentKey);

        const updatedDrugObj = Drug.createInstance(Object.assign({}, drugObj, { serialNo, owner: buyerCRN }));
        delete updatedDrugObj.serialNo;
        await ctx.drugList.addDrug(updatedDrugObj);

        console.log(`Drug - ${productId} in the shipment is updated for the shipment key - ${shipmentKey}`);

        return updatedDrugObj;
      }
    }));

    return newShipmentObj;
  }

  /**
   * Retail of a drug
   * @param ctx - The transaction context object
   * @param drugName - Name of the drug
   * @param serialNo - Serial number of a drug strip
   * @param retailerCRN - CRN of a retailer company
   * @param customerAadhar - Aadhar id of a customer
   * @returns {Object}
   */
  async retailDrug(ctx, drugName, serialNo, retailerCRN, customerAadhar) {
    // Validate if the initiator is a retailer
    if (ctx.clientIdentity.getMSPID() !== 'retailerMSP')
      throw new Error('Failed! Only Retailer is allowed to perform this action');

    // Fetch the drug details
    const drugKey = Drug.createKey([drugName, serialNo]);
    const drugDetails = await ctx.drugList
      .getDrug(drugKey)
      .catch(() => { throw new Error('Failed to fetch the drug') });
    const { owner } = drugDetails;

    // Validate the owner of a drug strip is same as the initiator
    if (owner !== retailerCRN) {
      throw new Error(`Retailer ${retailerCRN} is not the owner of the drug ${drugKey}`);
    }

    // Update the owner of the drug strip to customer's aadhar number
    const updatedDrugObj = Drug.createInstance(Object.assign({}, drugDetails, { owner: customerAadhar }));
    await ctx.drugList.addDrug(updatedDrugObj);

    return updatedDrugObj;
  }
}


module.exports = Transfer;