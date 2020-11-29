'use strict';

/**
 * This is a Node.JS application to fetch the drug's history on the network.
 */
const { getContractInstance, disconnect } = require('../utils/contract-helper');

async function main(drugName, serialNo, organisationRole) {
  try {
    const { lifecycleContract } = await getContractInstance(organisationRole);

    console.log('Fetching history for the shipment...');
    const txnBuffer = await lifecycleContract.submitTransaction('viewHistory', drugName, serialNo);
    const txnResponse = JSON.parse(txnBuffer.toString());

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
