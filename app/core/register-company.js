'use strict';

/**
 * This is a Node.JS application to register new company on the network.
 */
const { getContractInstance, disconnect } = require('../utils/contract-helper');

async function main(companyCRN, companyName, location, organisationRole) {
  try {
    const { registrationContract } = await getContractInstance(organisationRole);

    // Registering new company
    console.log('Registering new company...');
    const studentBuffer = await registrationContract.submitTransaction('registerCompany', companyCRN, companyName, location, organisationRole);
    const txnBuffer = JSON.parse(studentBuffer.toString());
    console.log('New company got registered!', txnBuffer);

    return txnBuffer;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    // Disconnect from the fabric gateway
    disconnect();
  }
}

module.exports.execute = main;
