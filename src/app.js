import {inject, PLATFORM} from 'aurelia-framework';
import {Client} from './client';


@inject(Client)
export class App {
  constructor(client) {
    this.client=client;
  }

  configureRouter(config, router) {
    config.title='Registry';
    this.router = router;
    config.map([
      {route:'', moduleId:PLATFORM.moduleName("query"), title: "Query Registry", nav: true},
      {route:"register", moduleId:PLATFORM.moduleName("register"), title: "Register Name", nav:true}
    ]);
  }
}
