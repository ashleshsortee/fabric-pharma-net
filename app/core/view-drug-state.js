'use strict';

/**
 * This is a Node.JS application to drug's current state on the network.
 */

const { getContractInstance, disconnect } = require('../utils/contract-helper');

async function main(drugName, serialNo, organisationRole) {
  try {
    const { lifecycleContract } = await getContractInstance(organisationRole);

    console.log('Fetching the drug`s current state...');
    const txnBuffer = await lifecycleContract.submitTransaction('viewDrugCurrentState', drugName, serialNo);
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
