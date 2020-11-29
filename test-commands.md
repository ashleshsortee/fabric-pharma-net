# registerCompany
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.registration:registerCompany","Manufacturer-1234", "Manufacturer", "Nagpur", "manufacturer"]}' && peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.registration:registerCompany","Distributor-1234", "Distributor", "Nagpur", "distributor"]}' && peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.registration:registerCompany","Retailer-1234", "Retailer", "Nagpur", "retailer"]}' && peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.registration:registerCompany","Transporter-1234", "Transporter", "Nagpur", "transporter"]}'

# addDrug
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.registration:addDrug","para", "para-1", "18/8/2020", "18/8/2025", "Manufacturer-1234"]}' && peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.registration:addDrug","para", "para-2", "18/8/2020", "18/8/2025", "Manufacturer-1234"]}' && peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.registration:addDrug","para", "para-3", "18/8/2020", "18/8/2025", "Manufacturer-1234"]}' 


# createPo - Manufacturer to Distributor
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.transfer:createPO", "Distributor-1234", "Manufacturer-1234", "para", "3"]}'

1, Validate if the distributor is purchasing drugs from the mentioned manufacturer

# createShipment - Manufacturer creates the shipment to the Distributor
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.transfer:createShipment", "Distributor-1234", "para", "para:para-1,para:para-2,para:para-3", "Transporter-1234"]}'


# updateShipment - Transporter updates the shipment status 
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.transfer:updateShipment", "Distributor-1234", "para", "Transporter-1234"]}'


-----------------------------------------------------------------------------------------------------------------------------------------------

# createPo - Distributor to Retailer
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.transfer:createPO", "Retailer-1234", "Distributor-1234", "para", "3"]}'

# createShipment - Distributor creates the shipment to the Retailer
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.transfer:createShipment", "Retailer-1234", "para", "para:para-1,para:para-2,para:para-3", "Transporter-1234"]}'

# updateShipment - Transporter updates the shipment status 
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.transfer:updateShipment", "Retailer-1234", "para", "Transporter-1234"]}'

----------------_----------------_----------------_----------------_----------------_----------------_----------------_----------------_----------------_

# retailDrug
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.transfer:retailDrug", "para", "para-1", "Retailer-1234", "AADHAR-1"]}'



# getDrug
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.registration:getDrug", "para", "para-1"]}'

# viewHistory
peer chaincode invoke -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -c '{"Args":["org.pharma-network.pharmanet.transfer:viewHistory", "para", "para-1"]}'


peer chaincode instantiate -o orderer.pharma-network.com:7050 -C pharmachannel -n pharmanet -l node -v 1.1 -c '{"Args":["org.pharma-network.pharmanet.transfer:instantiate"]}' -P "OR ('manufacturerMSP.member','distributorMSP.member', 'retailerMSP.member', 'consumerMSP.member', 'transporterMSP.member')" >&log.txt

companyCRN, companyName, location, organisationRole

drugName, serialNo, mfgDate, expDate, companyCRN

# createPO
buyerCRN, sellerCRN, drugName, quantity

buyerCRN, drugName, listOfAssets, transporterCRN


 buyerCRN, drugName, transporterCRN

   async retailDrug(ctx, drugName, serialNo, retailerCRN, customerAadhar) {
