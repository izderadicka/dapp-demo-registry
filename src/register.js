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
        this.client.register(this.name, this.value)
        .then(v=> {
            this.status={status:"done", msg:`Transaction ready with hash ${v}`,
            final:true}
            
        })
        .catch(err => {
            this.status={status:"fail", msg: `Transaction failed with ${JSON.stringify(err)}`,
                        final:true};
            
        })
    }

}