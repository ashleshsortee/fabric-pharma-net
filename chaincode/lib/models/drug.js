'use strict';

class Drug {
  /**
    * Constructor function
    * @param drugObj
    */
  constructor(drugObj) {
    this.key = Drug.createKey([drugObj.name, drugObj.serialNo]);
    Object.assign(this, drugObj);
  }

  /**
    * Create a new instance of this model
    * @returns {Drug}
    * @param drugObj {Object}
    */
  static createInstance(drugObj) {
    return new Drug(drugObj);
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
    return new Drug(json);
  }
}

module.exports = Drug;