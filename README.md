Demo Dapp for Ethereum - Registry
=================================

My test/demo distributed app for ethereum (using web3.js)

To test:
1. Install parity
2. Run parity - `parity --chain dev` and create accounts
3. Deploy contract from contract-src in parity
4. Clone this repo
5. Install aurelia CLI - `sudo npm install aurelia-cli -g`
6. Install dependencies - from cloned folder run `npm install`
7. Edit src/client.js - update contract address to contract deployed in parity
8. Run `au run`
9. Open in browser http://localhost:8080

To deploy into parity locally:
1. Run `au build --env prod`
2. Link dist to parity local dapps directory `ln -s dir_you_cloned_to/dist/ ~/.local/share/io.parity.ethereum/dapps/register`
3. Reload parity
4. Go to Applications tab in parity "DEMO NAMES REGISTRY" dapp should be there
