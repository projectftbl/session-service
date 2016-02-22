var _ = require('lodash')
  , twitter = require('@ftbl/social').twitter
  , publish = require('@ftbl/task').publish
  , request = require('@ftbl/request');

var Provider = function(authentication, context) {
  if (this instanceof Provider === false) return new Provider(authentication, context);

  this.authentication = authentication;
  this.context = context;
};

var mapAccountToUser = function(account, token, secret) {
  console.log(account);
  return {
    networkId: account.id.toString()
  , email: account.email
  , photo: account.profile_image_url_https
  , name: account.name
  , network: { 
      id: account.id
    , name: 'twitter'
    , token: token
    , secret: secret
    , link: account.link 
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
  var authentication = this.authentication;

  return twitter.verify(authentication.token, authentication.secret)

  .then(function(account) {
    if (account == null) return;

    return getUser(account, authentication.token, authentication.secret, this.context)

    .then(function(user) {
      if (user == null) return;

      user.token = authentication.token;
      user.secret = authentication.secret;

      publish('twitter', { user: user });

      return user;
    });
  }.bind(this));
};

module.exports = Provider;