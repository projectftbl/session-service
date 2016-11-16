var _ = require('lodash')
  , publish = require('@recipher/task').publish
  , request = require('@recipher/request');

var Provider = function(authentication, context) {
  if (this instanceof Provider === false) return new Provider(authentication, context);

  this.authentication = authentication;
  this.context = context;
};

var mapAccountToUser = function(authentication) {
  var account = authentication.data;

  return {
    networkId: authentication.id
  , email: account.email
  , photo: account.picture
  , name: account.name
  , network: { 
      id: authentication.id
    , name: 'google'
    , token: authentication.token
    , link: account.link
    }
  };
};

var getUser = function(authentication, context) {
  return request('users/users', context).get({ networkid: authentication.id })

  .then(function(data) {

    if (data.users.length === 0) {
      return request('users/users', context).post({ user: mapAccountToUser(authentication) })

      .then(function(data) {
        return data.user;
      });
    }

    return _(data.users).first(); 
  });
};

Provider.prototype.authenticate = function() {
  var context = this.context
    , authentication = this.authentication;

  return getUser(authentication, context).then(function(user) {
    if (user == null) return;

    publish('google.connected', { user: user }, context);

    return user;
  });
};

module.exports = Provider;