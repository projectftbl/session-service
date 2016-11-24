var _ = require('lodash')
  , request = require('@recipher/request');

var Provider = function(authentication, context) {
  if (this instanceof Provider === false) return new Provider(authentication, context);

  this.authentication = authentication;
  this.context = context;
};

Provider.prototype.authenticate = function() {
  var context = this.context
    , authentication = this.authentication;

  return request('authentication/me', context).get({ access_token: authentication.accessToken }).then(function(data) {
    if (data == null) return;

    return data.user;
  });
};

module.exports = Provider;