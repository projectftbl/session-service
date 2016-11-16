var _ = require('lodash')
  , twitter = require('@recipher/social').twitter
  , publish = require('@recipher/task').publish
  , request = require('@recipher/request');

var Provider = function(authentication, context) {
  if (this instanceof Provider === false) return new Provider(authentication, context);

  this.authentication = authentication;
  this.context = context;
};

var mapAccountToUser = function(account, token, secret) {
  return {
    networkId: account.id.toString()
  , email: account.email
  , photo: account.profile_image_url_https
  , name: account.name
  , network: { 
      id: account.id
    , name: 'twitter'
    , handle: account.screen_name
    , token: token
    , secret: secret
    , link: 'https://twitter.com/' + account.screen_name
    }
  };
};

var getUser = function(account, token, secret, context) {
  return request('users/users', context).get({ networkid: account.id })

  .then(function(data) {

    if (data.users.length === 0) {
      return request('users/users', context).post({ user: mapAccountToUser(account, token, secret) })

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

  return twitter.verify(authentication)

  .then(function(account) {
    if (account == null) return;

    return getUser(account, authentication.token, authentication.secret, context).then(function(user) {
      if (user == null) return;

      publish('twitter.connected', { user: user }, context);

      return user;
    });
  }.bind(this));
};

module.exports = Provider;