var configuration = require('@ftbl/configuration')
  , jwt = require('jsonwebtoken');

var secret = configuration('token:secret');

module.exports = function(user) {
  user.token = jwt.sign(user, secret, { algorithm: 'HS256' });
  return user;
};