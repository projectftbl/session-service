var signOn = require('../services/signon');

module.exports = function(middleware, errors) {
  
  return { 
    put: function *(next) { 
      if (this.session.id) {
        var authentication = { provider: 'email', email: this.session.email, reload: true };

        this.session = yield signOn(authentication, this.context);
      }

      this.status = 200;
      this.body = { session: this.session.id ? this.session : null };
    }
    
  , delete: function *(next) { 
      if (this.session.id == null) throw new errors.NotFound();

      this.session = null; 

      this.status = 200;
      this.body = { session: this.session };
    }
  };
};