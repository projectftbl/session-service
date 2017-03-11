var token = require('./token');

module.exports = function(authentication, context) {
  if (authentication.provider == null) authentication.provider = 'email';
  require('@recipher/log').info(authentication);
  require('@recipher/log').info(context);
  var Provider = require('./providers/' + authentication.provider);

  return new Provider(authentication, context).authenticate().then(function(user) {
    return token(user);
  });
};
