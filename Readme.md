# Fabric Pharma Network

A pharma supply chain network which helps to solve the problem of drug counterfeiting.  

## Network Bootstrap -

> **Note** - The development was done on macOS. So, all the bin files for fabric network is for macOS. These bin files need to be replaced in case if the network is tested on other OS.

1. Download the project folder.
2. cd to /network path
    ```sh    
    cd network
    ```
3. Restart the network so that the crypto configs are not created again as its already available in network folder.
    ```sh  
    sh ./fabricNetwork.sh restart
    ```
4. Open 5 new tabs in new window each for manufacturer, distributor, retailer, transporter and consumer chaincode container and bash into the containers.
    ```sh
    docker exec -it manufacturer.chaincode /bin/bash
	docker exec -it distributor.chaincode /bin/bash
    docker exec -it retailer.chaincode /bin/bash
    docker exec -it transporter.chaincode /bin/bash
    docker exec -it consumer.chaincode /bin/bash
    ```

5. Start the nodejs service in the respective chaincode container.
    a) In the manufacturer chaincode container -
    ```sh
    npm install
    npm run start-manufacturer
    ```
    b) In the distributor chaincode container -
    ```sh
    npm install
    npm run start-distributor
    ```
    c) In the retailer chaincode container -
    ```sh
    npm install
    npm run start-retailer
    ```
    d) In the transporter chaincode container -
    ```sh
    npm install
    npm run start-transporter
    ```
    e) In the consumer chaincode container -
    ```sh
    npm install
    npm run start-consumer
    ```sh
6. Install and intantiate the chaincode from the /network directory
    ```sh
    sh ./fabricNetwork.sh install
    ```

## Pharma Application Test-

> **Note** - The identity for all the entities are created for the admin user and are stored in identity folder at /app/identity. So, no need to re-trigger the /addToWallet api again. 

1. Open new tab and cd to /app directory in the folder.
    ```sh
    cd app
    ```
2. Start the nodejs service 
    ```sh
    npm install
    npm run start
    ```
3. Open Postman app and import the collections available in test folder at path ./test
4. Run the Initiation collection to register entities and drugs on the network with the delay of 1000 ms and check the save response in the configuration.
5. Run the Supply Chain collection to create a supply drugs from manufacturer to the user via distributor, retailer and transporter. Add the the delay of 1000 ms and check the save response in the configuration.
6. Run the History Track Down collection to know the history of transaction and the current state of the drug.
