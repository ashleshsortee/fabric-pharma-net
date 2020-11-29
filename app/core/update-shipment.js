'use strict';

/**
 * This is a Node.JS application to update the shipment on the network.
 */

const { getContractInstance, disconnect } = require('../utils/contract-helper');

async function main(buyerCRN, drugName, transporterCRN, organisationRole) {
  try {
    const { transferContract } = await getContractInstance(organisationRole);

    console.log('Updating the shipment...');
    const txnBuffer = await transferContract.submitTransaction('updateShipment', buyerCRN, drugName, transporterCRN);
    const txnResponse = JSON.parse(txnBuffer.toString());
    console.log('Shipment updated successfully!');

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
