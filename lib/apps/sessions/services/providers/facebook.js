var _ = require('lodash')
  , facebook = require('@ftbl/social').facebook
  , publish = require('@ftbl/task').publish
  , request = require('@ftbl/request');

var Provider = function(authentication, context) {
  if (this instanceof Provider === false) return new Provider(authentication, context);

  this.authentication = authentication;
  this.context = context;
};

var mapAccountToUser = function(account, accessToken) {
  return {
    networkId: account.id
  , photo: account.picture.data.url
  , name: account.name
  , gender: account.gender
  , email: account.email
  , network: { 
      id: account.id
    , name: 'facebook'
    , token: accessToken
    , link: account.link 
    }
  };
};

Provider.prototype.authorize = function() {
  return facebook.accessToken(this.authentication)

  .then(function(data) {
    var accessToken = data.access_token;

    return facebook.user(accessToken)

    .then(function(user) {
      return mapAccount(user, accessToken);
    });
  });
};

var getUser = function(account, accessToken, context) {
  return request('users/users', context).get({ networkid: account.id })

  .then(function(data) {

    if (data.users.length === 0) {
      return request('users/users', context).post({ user: mapAccountToUser(account, accessToken) })

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

  return facebook.user(authentication.accessToken)

  .then(function(account) {
    if (account == null) return;

    return getUser(account, authentication.accessToken, context).then(function(user) {
      if (user == null) return;

      publish('facebook.connected', { user: user }, context);

      return user;
    });
  });
};

module.exports = Provider;