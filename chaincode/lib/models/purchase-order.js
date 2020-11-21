'use strict';

class PurchaseOrder {
  /**
    * Constructor function
    * @param purchaseOrderObj
    */
  constructor(purchaseOrderObj) {
    this.key = PurchaseOrder.createKey([purchaseOrderObj.buyerCRN, purchaseOrderObj.drugName]);
    Object.assign(this, purchaseOrderObj);
  }

  /**
    * Create a new instance of this model
    * @returns {PurchaseOrder}
    * @param purchaseOrderObj {Object}
    */
  static createInstance(purchaseOrderObj) {
    return new PurchaseOrder(purchaseOrderObj);
  }

  /**
   * Create a key string joined from different key parts
   * @param keyChunks {Array}
   * @returns {*}
   */
  static createKey(keyChunks) {
    return keyChunks.map(chunk => String(chunk)).join(':');
  }

  /**
   * Create an array of key parts for this model instance
   * @returns {Array}
   */
  getKeyArray() {
    return this.key.split(":");
  }

  /**
   * Convert the object of this model to a buffer stream
   * @returns {Buffer}
   */
  toBuffer() {
    return Buffer.from(JSON.stringify(this));
  }

  /**
   * Convert the buffer stream received from blockchain into an object of this model
   * @param buffer {Buffer}
   */
  static fromBuffer(buffer) {
    const json = JSON.parse(buffer.toString());
    return new PurchaseOrder(json);
  }
}

module.exports = PurchaseOrder;