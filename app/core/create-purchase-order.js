'use strict';

/**
 * This is a Node.JS application to add a new purchase order on the network.
 */
const { getContractInstance, disconnect } = require('../utils/contract-helper');

async function main(buyerCRN, sellerCRN, drugName, quantity, organisationRole) {
  try {
    const { transferContract } = await getContractInstance(organisationRole);

    // Create new purchase order
    console.log('Creating new purchase order...');
    const transactionBuffer = await transferContract.submitTransaction('createPO', buyerCRN, sellerCRN, drugName, quantity);
    const transactionResp = JSON.parse(transactionBuffer.toString());
    console.log('Created new purchase order!', transactionResp);

    return transactionResp;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);

  } finally {
    // Disconnect from the fabric gateway
    disconnect();
  }
}

module.exports.execute = main;
