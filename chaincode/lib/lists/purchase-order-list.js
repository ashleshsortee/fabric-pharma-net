'use strict';

const PurchaseOrder = require('../models/purchase-order');

class PurchaseOrderList {
  constructor(ctx) {
    this.ctx = ctx;
    this.name = `org.pharma-network.pharmanet.lists.purchase-order`;
  }

  // Add purchase order model to the ledger
  async addPurchaseOrder(requestObj) {
    const purchaseOrderCompositeKey = this.ctx.stub.createCompositeKey(this.name, requestObj.getKeyArray());
    const requestBuffer = requestObj.toBuffer();
    await this.ctx.stub.putState(purchaseOrderCompositeKey, requestBuffer);
  }

  // Fetch purchase order model from the ledger
  async getPurchaseOrder(purchaseOrderKey) {
    const purchaseOrderCompositeKey = this.ctx.stub.createCompositeKey(this.name, purchaseOrderKey.split(':'));
    const purchaseOrderBuffer = await this.ctx.stub.getState(purchaseOrderCompositeKey);
    return PurchaseOrder.fromBuffer(purchaseOrderBuffer);
  }
}

module.exports = PurchaseOrderList;
