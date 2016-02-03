module.exports = function(middleware, errors) {
  
  return { 
    put: function *(next) { 
      this.status = 200;
      this.body = { session: {} };
    }
    
  , delete: function *(next) { 
      this.session = null; 

      this.status = 200;
      this.body = { session: this.session };
    }
  };
};