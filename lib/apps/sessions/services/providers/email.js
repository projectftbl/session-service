var _ = require('lodash')
  , request = require('@ftbl/request')
  , errors = require('@ftbl/errors');

var Provider = function(authentication, context) {
  if (this instanceof Provider === false) return new Provider(authentication, context);

  this.authentication = authentication;
  this.context = context;
};

Provider.prototype.authenticate = function() {
  var authentication = this.authentication
    , username = authentication.username
    , email = authentication.email
    , password = authentication.reload ? undefined : authentication.password || '';

  return request('users/users/search', this.context).post({ email: email, username: username, password: password })

  .then(function(data) {
    if (data.users.length === 0) throw new errors.NotFoundError();

    var user = _(data.users).first();

    if (user.isLocked) throw new errors.NotAuthorizedError('Locked'); 

    return user;
  });
};

module.exports = Provider;