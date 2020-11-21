'use strict';

class Entity {
  /**
    * Constructor function
    * @param regObj
    */
  constructor(regObj) {
    this.key = Entity.createKey([regObj.companyCRN, regObj.companyName]);
    Object.assign(this, regObj);
  }

  /**
    * Create a new instance of this model
    * @returns {Entity}
    * @param regObj {Object}
    */
  static createInstance(regObj, keys) {
    return new Entity(regObj, keys);
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
    return new Entity(json);
  }
}

module.exports = Entity;