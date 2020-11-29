'use strict';

/**
 * This is a Node.JS application to add a new shipment on the network.
 */
const { getContractInstance, disconnect } = require('../utils/contract-helper');

async function main(buyerCRN, drugName, listOfAssets, transporterCRN, organisationRole) {
  try {
    const { transferContract } = await getContractInstance(organisationRole);

    console.log('Adding new shipment...');
    const txnBuffer = await transferContract.submitTransaction('createShipment', buyerCRN, drugName, listOfAssets, transporterCRN);
    const txnResponse = JSON.parse(txnBuffer.toString());
    console.log('\n\n.....Create Student Transaction Complete!', txnResponse);

    return txnResponse;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    // Disconnect from the fabric gateway
    disconnect();
  }
}

module.exports.execute = main;
