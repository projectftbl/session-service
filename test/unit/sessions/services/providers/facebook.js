var proxyquire = require('proxyquire');

var validToken = 'abcdefgh'
  , invalidToken = '12345678';

var facebookUser = {
  id: '123'
, picture: { data: { url: 'http://www.facebook.com/123.png' }}
, name: 'john'
, gender: 'male'
, email: 'john@email.com'
, link: 'http://www.facebook.com/123'
};

var expectation = {
  networkId: facebookUser.id
, photo: facebookUser.picture.data.url
, name: facebookUser.name
, gender: facebookUser.gender
, email: facebookUser.email
, link: facebookUser.link
, token: facebookUser
, network: 'facebook'
};

var user = sinon.stub();
user.withArgs(validToken).resolves(facebookUser);
user.withArgs(invalidToken).resolves(null);

var publish = sinon.stub().resolves(expectation)
  , post = sinon.stub().resolves(expectation)
  , get = sinon.stub().resolves();

var social = { facebook: { user: user }}
  , task = { publish: publish }
  , request = function() { return { post: post, get: get }};

var Sut = proxyquire('../../../../../lib/apps/sessions/services/providers/facebook'
                          , { '@ftbl/social': social, '@ftbl/request': request, '@ftbl/task': task });

describe.only('When using facebook provider', function() {
    
  describe('When authenticating with a valid token', function() {

    before(function() {
      var sut = new Sut({ provider: 'facebook', accessToken: validToken });
      return sut.authenticate();
    });
  
    after(function() {
      publish.reset();
      post.reset();
    });

    it('should call facebook.user', function() {
      return user.should.be.called;
    });

    it('should publish the user to facebook', function() {
      return publish.should.be.calledWith('facebook', { user: expectation });
    });
  });

  describe('When authenticating with an invalid token', function() {

    before(function() {
      var sut = new Sut({ provider: 'facebook', accessToken: invalidToken });
      return sut.authenticate();
    });

    it('should call facebook.user', function() {
      return user.should.be.called;
    });
  
    it('should not publish the user to facebook', function() {
      publish.should.not.be.called;
    });
  });

});
