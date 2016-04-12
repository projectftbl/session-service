var signOn = require('../services/signon');

module.exports = function(middleware, errors) {
  
  return { 
    put: function *(next) {
      if (this.session == null || this.session.id == null) throw new errors.NotFoundError();

      var authentication = { provider: 'email', username: this.session.handle, reload: true };

      this.session = yield signOn(authentication, this.context);

      this.status = 200;
      this.body = { session: this.session };
    }
    
  , delete: function *(next) { 
      if (this.session.id == null) throw new errors.NotFoundError();

      this.session = null; 

      this.status = 200;
      this.body = { session: this.session };
    }
  };
};