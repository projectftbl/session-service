module.exports = function(authentication, context) {
  if (authentication.provider == null) authentication.provider = 'email';

  var Provider = require('./providers/' + authentication.provider);

  return new Provider(authentication, context).authenticate();
};
