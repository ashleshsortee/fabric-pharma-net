'use strict';

const { getContractInstance, disconnect } = require('../utils/contract-helper');

async function main(drugName, serialNo, retailerCRN, customerAadhar, organisationRole) {
  try {
    const { transferContract } = await getContractInstance(organisationRole);
    const txnBuffer = await transferContract.submitTransaction('retailDrug', drugName, serialNo, retailerCRN, customerAadhar);
    const txnResponse = JSON.parse(txnBuffer.toString());
    console.log(txnResponse);

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
