var _ = require('lodash')
  , request = require('@ftbl/request')
  , errors = require('@ftbl/errors');

var Provider = function(authentication, context) {
  if (this instanceof Provider === false) return new Provider(authentication);

  this.authentication = authentication;
  this.context = context;
};

Provider.prototype.authenticate = function() {
  var authentication = this.authentication
    , context = this.context
    , verificationCode = authentication.verificationCode;

  return request('users/users/search', context).post({ verificationcode: verificationCode })

  .then(function(data) {
    if (data.users.length === 0) throw new errors.NotFoundError();

    var user = _(data.users).first();

    return request('users/users/' + user.id, context)
    .put({ user: { verificationCode: null, shouldChangePassword: true, isLocked: false }})
    .then(function(data) {
      return data.user;
    });
  });
};

module.exports = Provider;