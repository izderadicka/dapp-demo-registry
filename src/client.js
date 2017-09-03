
import Web3 from 'web3';


// needs to be changed to address of actual contract
const contractAddress ='0xe97e2f937271826c0Df3347B36d8Ad782eE05FB9';
const contractABI = [{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"string"},{"name":"value","type":"string"}],"name":"register","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[{"name":"key","type":"string"}],"name":"query","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"fee","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"key","type":"string"},{"name":"to","type":"address"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"initialFee","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"name","type":"string"},{"indexed":false,"name":"who","type":"address"}],"name":"Register","type":"event"}];

function toPromise(fn, ...args) {
    return new Promise((resolve, reject) => {
        if (! (typeof(fn) === 'function')) {
            reject("Param is not a function");
        } else {
        try {
        fn(...args, (err,v) => {
            if (err) {
                reject(err)
            } else {
                resolve(v);
            }
        })
        }
        catch(e) {
            reject("Function call error: "+ JSON.stringify(e));
        }
    }
    })
}

export class Client {
    constructor() {
        this.fee = 0;
        let web3;
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        }
        else if (window.location.pathname == "/register/") {
            // in parity
            let rpcURL = `${window.location.protocol}//${window.location.host}/rpc/`;
            web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));
          } else {
            // set the provider you want from Web3.providers
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
          }
        this.web3 = web3;
        window.web3 = web3; // just for development

        
        this.registry = this.web3.eth.contract(contractABI).at(contractAddress);
        
        toPromise(this.registry.fee.call)
        .catch(e => console.log(`Fee error: ${JSON.stringify(e)}`))
        .then(v =>{
                this.fee = v;
                console.log(`Fee is ${this.fee}`);
                }
        );

        this._listeners = [];
        let fromBlock = this.web3.eth.blockNumber-10;
        this.registry.Register({},{fromBlock, toBlock:'latest'}).watch((err,data) => {
            if (!err) {
                console.log(`Got event ${JSON.stringify(data)}`)
                setTimeout(() => {
                    for (let l of this._listeners) {
                        l(data);
                    }
                }, 0)
            }
        });

        this._listeners = [];
    }

    addListener(fn) {
        this._listeners.push(fn);
    }

    get connected() {
        let now = new Date();
        if (! this._last || (now -this._last) > 10000) {
            this._last = now; 
            this._conn = this.web3.isConnected();
            return this._conn;
        } else {
            return this._conn;
        }
    }

    query(name) {
        return toPromise(this.registry.query.call,name);
    }

    register(name, value) {
        let address = this.web3.eth.accounts[0];
        // fist estimate gas in local VM
        let data = this.registry.register.getData(name, value);
        let estimatePromise = toPromise(this.web3.eth.estimateGas,
            {
             to: this.registry.address,
             data:data,   
            from: address,
            value: this.fee});
        //then send it to blockchain
        let sendPromise = estimatePromise
            .then( (gas) => { 
            console.log(`Estimate succeded with ${gas}`);
            return toPromise(this.registry.register.sendTransaction, name, value,
            {from: address,
            value: this.fee,
            gas
            })
        });
        // and get reciept
        let receiptPromise = sendPromise.then(txHash => {
            return toPromise(this.web3.eth.getTransactionReceipt,txHash);
        })
        return {send: sendPromise, receipt: receiptPromise, estimate: estimatePromise};
    }

    
    
}