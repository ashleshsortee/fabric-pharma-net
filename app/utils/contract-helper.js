'use strict';

const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
let gateway;

async function getContractInstance(organisationRole) {
  const org = organisationRole.toLowerCase();

  // A gateway defines which peer is used to access Fabric network
  // It uses a common connection profile (CCP) to connect to a Fabric Peer
  gateway = new Gateway();

  // A wallet is where the credentials to be used for this transaction exist
  const wallet = new FileSystemWallet(`./identity/${org}`);

  // The username of this Client user accessing the network
  const fabricUserName = `${org}_admin`;

  // Load connection profile; will be used to locate a gateway; The CCP is converted from YAML to JSON.
  let connectionProfile = yaml.safeLoad(fs.readFileSync(`./ccp/${org}.yaml`, 'utf8'));

  // Set connection options; identity and wallet
  let connectionOptions = {
    wallet: wallet,
    identity: fabricUserName,
    discovery: { enabled: false, asLocalhost: true }
  };

  // Connect to gateway using specified parameters
  console.log('.....Connecting to Fabric Gateway');
  await gateway.connect(connectionProfile, connectionOptions);

  console.log('.....Connecting to channel - pharmachannel');
  const channel = await gateway.getNetwork('pharmachannel');

  // Get instance of deployed Certnet contract
  // @param Name of chaincode
  // @param Name of smart contract
  console.log('.....Connecting to Certnet Smart Contract');
  return {
    registrationContract: channel.getContract('pharmanet', 'org.pharma-network.pharmanet.registration'),
    transferContract: channel.getContract('pharmanet', 'org.pharma-network.pharmanet.transfer'),
    lifecycleContract: channel.getContract('pharmanet', 'org.pharma-network.pharmanet.lifecycle'),
  }
}

function disconnect() {
  console.log('.....Disconnecting from Fabric Gateway');
  gateway.disconnect();
}

module.exports.getContractInstance = getContractInstance;
module.exports.disconnect = disconnect;