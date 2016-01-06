module.exports = function(router, resource, middleware, errors) {
  var sessions = resource.sessions(middleware, errors)
    , session = resource.session(middleware, errors);
  
  router.get('/', sessions.get);
  router.post('/', sessions.post);
  
  router.put('/:id?', session.put);
  router.del('/:id?', session.delete);
};
