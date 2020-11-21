'use strict';

const Shipment = require('../models/shipment');

class ShipmentList {
  constructor(ctx) {
    this.ctx = ctx;
    this.name = `org.pharma-network.pharmanet.lists.shipment`;
  }

  // Add shipment model to the ledger
  async addShipment(shipmentObj) {
    const shipmentCompositeKey = this.ctx.stub.createCompositeKey(this.name, shipmentObj.getKeyArray());
    const shipmentBuffer = shipmentObj.toBuffer();
    await this.ctx.stub.putState(shipmentCompositeKey, shipmentBuffer);
  }

  // Fetch shipment model from the ledger
  async getShipment(shipmentKey) {
    const shipmentCompositeKey = this.ctx.stub.createCompositeKey(this.name, shipmentKey.split(':'));
    const shipmentBuffer = await this.ctx.stub.getState(shipmentCompositeKey);
    return Shipment.fromBuffer(shipmentBuffer);
  }
}

module.exports = ShipmentList;
