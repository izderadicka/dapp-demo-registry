import {inject} from 'aurelia-framework';
import {Client} from './client';

@inject(Client)
export class Register {

    constructor(client) {
        this.client = client;
        this.reset();
        
    }

    get fee() {
        return this.client.fee / 1e18;
    }

    reset() {
        this.value=null;
        this.name=null;
        this.status = null;
    }

    get alertType() {
        if (this.status && this.status.status == 'done')
            return 'success';
        else if (this.status && this.status.status == 'fail')
            return 'danger';
        else 
            return 'warning';
    }

    register() {
        this.status = {status:"submit", msg: "Sent for signature"}
        let res = this.client.register(this.name, this.value);
        res.send.then(v=> {
            this.status={status:"send", msg:`Transaction send with hash ${v}`}
        });

        res.receipt.then(r=> {
            this.status={status:"done", msg:`Transaction confirmed in block ${r.blockNumber}`,
                final:true};
        });

        Promise.all([res.send, res.receipt])
        .catch(err => {
            this.status={status:"fail", msg: `Transaction failed, error: ${JSON.stringify(err)}`,
                        final:true};
            
        })
    }

}