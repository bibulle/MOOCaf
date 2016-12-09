
var debug = require('debug')('server:service:open-stack');

export default class OpenStackService {



  //noinspection TypeScriptUnresolvedVariable,TypeScriptValidateJSTypes
  static openStack = require('pkgcloud').compute.createClient({
    provider: 'openstack', // required
    username: 'User_DevNet', // required
    password: 'D3vNet', // required
    region: 'regionOne',
    tenantName: 'Tenant_DevNet',
    authUrl: 'http://10.71.68.10:5000', // required
    version: "v2.0"
  });




  /**
   * rebuildServerByName
   * @param serverName
   * @returns {Promise<void>}
   */
  static rebuildServerByName(serverName: string): Promise<void> {

    return new Promise<void>((resolve, reject) => {
      // Get servers
      OpenStackService
        .getServers()
        .then(servers => {

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