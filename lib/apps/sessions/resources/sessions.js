var signOn = require('../services/signon')

module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) {
      this.status = 200;
      this.body = { session: this.session.id ? this.session : null };
    }
   
  , post: function *(next) { 
      var session = yield signOn(this.request.body.authentication, this.context);
      
      if (session == null) throw new errors.NotFoundError();

      this.status = 200;
      this.session = session;
      this.body = { session: session }; 
    }
  };
};