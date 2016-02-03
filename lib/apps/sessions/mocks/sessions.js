module.exports = function(middleware, errors) {
  
  return { 
    get: function *(next) {
      this.status = 200;
      this.body = { session: {} };
    }
   
  , post: function *(next) { 
      this.status = 200;
      this.session = {};
      this.body = { session: this.session }; 
    }
  };
};