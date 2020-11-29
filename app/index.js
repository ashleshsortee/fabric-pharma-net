const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;

// Import all function modules
const addToWallet = require('./core/add-to-wallet');
const registerCompany = require('./core/register-company');
const addDrug = require('./core/add-drug');
const createPO = require('./core/create-purchase-order');
const createShipment = require('./core/create-shipment');
const updateShipment = require('./core/update-shipment');
const viewHistory = require('./core/view-history');
const viewDrugCurrentState = require('./core/view-drug-state');
const retailDrug = require('./core/retail-drug');

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set('title', 'Pharma App');

app.get('/', (req, res) => res.send('Healthy!'));

app.post('/addToWallet', (req, res) => {
  addToWallet.execute(req.body.certificatePath, req.body.privateKeyPath, req.body.organisation)
    .then(() => {
      console.log('User credentials added to wallet');
      const result = {
        status: 'success',
        message: 'User credentials added to wallet'
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed to add creds for user',
        error: e
      };
      return res.status(500).send(result);
    });
});

app.post('/registerCompany', (req, res) => {
  registerCompany.execute(req.body.companyCRN, req.body.companyName, req.body.location, req.body.organisationRole)
    .then(response => {
      console.log(`${response.companyName} got registered successfully!`);
      const result = {
        status: 'success',
        message: `${response.companyName} got registered successfully!`,
        data: response,
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed to register the company!',
        error: e
      };
      return res.status(500).send(result);
    });
});

app.post('/addDrug', (req, res) => {
  addDrug.execute(req.body.drugName, req.body.serialNo, req.body.mfgDate, req.body.expDate, req.body.companyCRN, req.body.organisationRole)
    .then(response => {
      console.log(`Drug-${response.productId} registered successfully!`);
      const result = {
        status: 'success',
        message: `Drug-${response.productId} registered successfully!`,
        data: response,
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed to register a drug!',
        error: e
      };
      return res.status(500).send(result);
    });
});

app.post('/createPO', (req, res) => {
  const { buyerCRN, sellerCRN, drugName, quantity, organisationRole } = req.body;

  createPO.execute(buyerCRN, sellerCRN, drugName, quantity, organisationRole)
    .then(response => {
      console.log(`Purchase order for drug ${response.drugName} with ${response.quantity} placed successfully!`);
      const result = {
        status: 'success',
        message: `Purchase order for drug ${drugName}`,
        data: response,
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed to create a place order',
        error: e
      };
      return res.status(500).send(result);
    });
});


app.post('/createShipment', (req, res) => {
  const { buyerCRN, drugName, listOfAssets, transporterCRN, organisationRole } = req.body;

  createShipment.execute(buyerCRN, drugName, listOfAssets, transporterCRN, organisationRole)
    .then(response => {
      console.log(`Shipment for ${drugName} created successfully for the buyer ${buyerCRN}!`);
      const result = {
        status: 'success',
        message: `Shipment for ${drugName} created successfully for the buyer ${buyerCRN}!`,
        data: response,
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed to create a shipment!',
        error: e
      };
      return res.status(500).send(result);
    });
});

app.post('/updateShipment', (req, res) => {
  const { buyerCRN, drugName, transporterCRN, organisationRole } = req.body;

  updateShipment.execute(buyerCRN, drugName, transporterCRN, organisationRole)
    .then(response => {
      console.log('Shipment updated successfully!');
      const result = {
        status: 'success',
        message: 'Shipment updated successfully!',
        data: response,
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed to update the shipment!',
        error: e
      };
      return res.status(500).send(result);
    });
});

app.post('/retailDrug', (req, res) => {
  const { drugName, serialNo, retailerCRN, customerAadhar, organisationRole } = req.body;

  retailDrug.execute(drugName, serialNo, retailerCRN, customerAadhar, organisationRole)
    .then(response => {
      const result = {
        status: 'success',
        data: response,
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed!',
        error: e
      };
      return res.status(500).send(result);
    });
});

app.post('/viewHistory', (req, res) => {
  const { drugName, serialNo, organisationRole } = req.body;

  viewHistory.execute(drugName, serialNo, organisationRole)
    .then(response => {
      const result = {
        status: 'success',
        data: response,
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed to fetch the history!',
        error: e
      };
      return res.status(500).send(result);
    });
});

app.post('/viewDrugCurrentState', (req, res) => {
  const { drugName, serialNo, organisationRole } = req.body;

  viewDrugCurrentState.execute(drugName, serialNo, organisationRole)
    .then(response => {
      const result = {
        status: 'success',
        data: response,
      };
      return res.status(200).json(result);
    })
    .catch((e) => {
      const result = {
        status: 'error',
        message: 'Failed to fetch the drug`s current state!',
        error: e
      };
      return res.status(500).send(result);
    });
});

app.listen(port, () => console.log(`Distributed Pharma App listening on port ${port}!`));
