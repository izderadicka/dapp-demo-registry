
import {inject, bindable} from 'aurelia-framework';
import {Client} from './client';

@inject(Client)
export class Query {
    @bindable name = null;
    value = '';

    constructor(client) {
        this.client =  client;
    }

    lookup() {
        this.client.query(this.name)
        .then(v => this.value=v)
        .catch(err => alert('Query error'+JSON.stringify(err)));
    }

    clearValue() {
        this.value='';
    }

    nameChanged() {
        this.lookup();
    }
    
}