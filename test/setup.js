var chai = require('chai')
  , sinon = require('sinon')
  , should = chai.should()

chai.use(require('sinon-chai'));
chai.use(require('chai-as-promised'));
require('sinon-as-promised')(require('bluebird'));

global.chai = chai;
global.sinon = sinon;
global.should = should;
global.noOp = function() { /* no op */ };