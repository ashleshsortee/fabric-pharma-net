'use strict';

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
*/

const fs = require('fs'); // FileSystem Library
const { FileSystemWallet, X509WalletMixin } = require('fabric-network'); // Wallet Library provided by Fabric

async function main(certificatePath, privateKeyPath, organisation) {
  try {
    // A wallet is a filesystem path that stores a collection of Identities
    const wallet = new FileSystemWallet(`./identity/${organisation}`);
    const certificate = fs.readFileSync(certificatePath).toString();
    const privatekey = fs.readFileSync(privateKeyPath).toString();

    // Load credentials into wallet
    const identityLabel = `${organisation}_admin`;
    const identity = X509WalletMixin.createIdentity(`${organisation}MSP`, certificate, privatekey);

    await wallet.import(identityLabel, identity);
  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
    throw new Error(error);
  }
}

module.exports.execute = main;
