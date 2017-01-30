
var debug = require('debug')('server:service:open-stack:debug');
var info = require('debug')('server:service:open-stack:info');
var error = require('debug')('server:service:open-stack:error');

export default class OpenStackService {



  //noinspection TypeScriptUnresolvedVariable,TypeScriptValidateJSTypes
  static openStack = require('pkgcloud').compute.createClient({
    provider: 'openstack', // required
    //useServiceCatalog: false,
    //useInternal: false,
    //domainName: 'Default',
    //projectDomainName: 'Default',
    username: 'User_DevNet', // required
    password: 'D3vNet', // required
    region: 'regionOne',
    tenantName: 'Tenant_DevNet',
    authUrl: 'http://10.71.68.10:5000', // required
    //keystoneAuthVersion: 'v3',
    //version: "v3",
    //url: "http://10.71.68.10:8774/v2/4b3905ae3def440da48a4ceca7e29192"
  });

  /*
  BE CAREFUL, pkgcloud must be patch :
    in serviceCatalog.js


   var ServiceCatalog = function (catalog) {
   var self = this;

   self.services = {};

   _.each(catalog, function (service) {
   // Special hack for rackspace with two compute types
   if (service.type === 'compute' && service.name === 'cloudServers') {
   return;
   }

   if (!self.services[service.name])   <==== added line
       self.services[service.name] = new Service(service);
   });
   };

   */




  /**
   * rebuildServerByName
   * @param serverName
   * @returns {Promise<void>}
   */
  static rebuildServerByName(serverName: string): Promise<void> {
    debug("rebuildServerByName "+serverName);

    return new Promise<void>((resolve, reject) => {
      // Get servers
      OpenStackService
        .getServers()
        .then(servers => {

          debug("  servers found "+servers);
          var serverMOOC;

          servers.forEach(server => {
            if (serverMOOC) {
              return
            }

            if (server.name === serverName) {
              serverMOOC = server;
            }
          });

          if (serverMOOC) {
            OpenStackService
              .rebuildServer(
                serverMOOC,
                {
                  image: serverMOOC['imageId']
                }
              )
              .then(() => {
                  resolve();
                }
              )
              .catch(err=> {
                reject(err);
              })
          }
        })
        .catch(err=> {
          reject(err);
        })
    })
  }


  /**
   * Get server lists
   * @returns {Promise<any[]>}
   */
  static getServers(): Promise<any[]> {

    return new Promise((resolve, reject) => {

      //noinspection TypeScriptValidateJSTypes
      OpenStackService.openStack.getServers(
        (err, servers) => {
          if (err) {
            reject(err);
          } else {
            resolve(servers);
          }
        })
    });
  }


  /**
   * Get a server by Id or Server
   * @param server
   * @returns {Promise<any>}
   */
  static getServer(server: string): Promise<any> {

    return new Promise((resolve, reject) => {

      //noinspection TypeScriptValidateJSTypes
      OpenStackService.openStack.getServer(
        server,
        (err, servers) => {
          if (err) {
            reject(err);
          } else {
            resolve(servers);
          }
        })
    });

  }

  /**
   * Rebuild a server
   * @param server
   * @param options
   * @returns {Promise<any[]>}
   */
  static rebuildServer(server: {}, options: {}): Promise<any[]> {

    return new Promise((resolve, reject) => {

      //noinspection TypeScriptValidateJSTypes
      OpenStackService.openStack.rebuildServer(
        server,
        options,
        (err, servers) => {
          if (err) {
            reject(err);
          } else {
            resolve(servers);
          }
        })
    });

  }



}