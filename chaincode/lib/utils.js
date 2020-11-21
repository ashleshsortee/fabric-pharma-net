'use strict';

var ByteBuffer = require("bytebuffer");

// Function to fetch the result from iterator
async function iterateResult(iterator) {
  let result = await iterator.next();

  while (true) {
    if (result.value && result.value.value) {
      var bb = ByteBuffer.wrap(result.value.value);
      var b = new Buffer(bb.toArrayBuffer());
      return b;
    }
    if (result.done) {
      iterator.close();
      break;
    }
    result = await iterator.next();
  }
}

// Fetch the result from the iterator
async function iterateResultBulk(iterator) {
  let result = await iterator.next();
  const resultArr = [];

  while (true) {
    if (result.value && result.value.value) {
      var bb = ByteBuffer.wrap(result.value.value);
      var b = new Buffer(bb.toArrayBuffer());
      const json = JSON.parse(b.toString());
      resultArr.push(json);
    }
    if (result.done) {
      iterator.close();
      break;
    }
    result = await iterator.next();
  }

  return resultArr;
}

// Fetch the iterator result for audit
async function iterateDrugAudit(iterator) {
  let result = await iterator.next();
  const resultArr = [];

  while (true) {
    const jsonRes = {};
    const timestamp = result.value.timestamp;
    const milliseconds = (timestamp.seconds.low + ((timestamp.nanos / 1000000) / 1000)) * 1000;

    jsonRes.TxId = result.value.tx_id;
    jsonRes.Timestamp = new Date(milliseconds).toString();
    jsonRes.IsDelete = result.value.is_delete;

    if (result.value && result.value.value) {
      jsonRes.Record = JSON.parse(result.value.value.toString('utf8'));
      resultArr.push(jsonRes);
    }
    if (result.done) {
      iterator.close();
      break;
    }
    result = await iterator.next();
  }

  return resultArr;
}

// Get the organisation's hirarchy
const getEntityHirarchy = orgRole => {
  switch (orgRole) {
    case 'manufacturer':
      return 1;
    case 'distributor':
      return 2;
    case 'retailer':
      return 3;
    case 'transporter':
      return null;
    default:
      throw new Error(`Invalid organisation role - ${orgRole} to fetch entity's hirarchy`);
  }
}

module.exports = { getEntityHirarchy, iterateResult, iterateResultBulk, iterateDrugAudit };