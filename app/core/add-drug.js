'use strict';

/**
 * This is a Node.JS application to add a new drug on the network.
 */
const { getContractInstance, disconnect } = require('../utils/contract-helper');

async function main(drugName, serialNo, mfgDate, expDate, companyCRN, organisationRole) {
  try {
    const { registrationContract } = await getContractInstance(organisationRole);

    // Registering new drug
    console.log('Registering new drug...');
    const transactionBuffer = await registrationContract.submitTransaction('addDrug', drugName, serialNo, mfgDate, expDate, companyCRN);
    console.log('Registering drug...');
    const newDrug = JSON.parse(transactionBuffer.toString());
    console.log('Drug registration completed!', newDrug);

    return newDrug;
  } catch (error) {

    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);

  } finally {
    // Disconnect from the fabric gateway
    disconnect();

  }
}

module.exports.execute = main;
