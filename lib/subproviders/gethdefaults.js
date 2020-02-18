var Subprovider = require('web3-provider-engine/subproviders/subprovider.js');
var inherits = require("util").inherits;

inherits(GethDefaults, Subprovider);

module.exports = GethDefaults;

function GethDefaults() {};

// Massage vns_estimateGas requests, setting default data (e.g., from) if
// not specified. This is here specifically to make the testrpc
// react like Gvns.
GethDefaults.prototype.handleRequest = function(payload, next, end) {
  var self = this;

  if (payload.method != "vns_estimateGas" && payload.method != "vns_call") {
    return next();
  }

  var params = payload.params[0];

  if (params.from == null) {
    this.emitPayload({
      method: "vns_coinbase"
    }, function(err, result) {
      if (err) return end(err);

      var coinbase = result.result;

      params.from = coinbase;
      next();
    });
  } else {
    next();
  }
};
