'use strict';

var expect = require('chai').expect
  , proxyquire = require('proxyquire')
  , sinon = require('sinon');

describe('index', function () {
  var mod
    , generateLineProtocolStringStub
    , escapeMeasureNameStub
    , generateTagStringStub
    , generateFieldStringStub;

  beforeEach(function () {
    generateLineProtocolStringStub = sinon.stub();
    escapeMeasureNameStub = sinon.stub();
    generateTagStringStub = sinon.stub();
    generateFieldStringStub = sinon.stub();

    mod = proxyquire('index.js', {
      './util': {
        generateLineProtocolString: generateLineProtocolStringStub,
        escapeMeasureName: escapeMeasureNameStub,
        generateTagString: generateTagStringStub,
        generateFieldString: generateFieldStringStub
      }
    });
  });

  describe('#JsonInfluxDbStream', function () {
    it('should be an exposed function', function () {
      expect(mod.JsonInfluxDbStream).to.be.a('function');
    });
  });
  describe('#convert', function () {
    it('should be exported', function () {
      expect(mod.convert).to.be.a('function');
    });

    it('should call the util converter', function () {
      var f = {a:'b'};
      var t = {c:'d'};
      var m = 'name';
      var ts = Date.now();

      escapeMeasureNameStub.returns(m);
      generateTagStringStub.returns('c=d');
      generateFieldStringStub.returns('a=b');

      mod.convert({
        ts: ts,
        fields: f,
        tags: t,
        measurement: m
      });

      expect(escapeMeasureNameStub.getCall(0).args[0]).to.equal(m);
      expect(generateTagStringStub.getCall(0).args[0]).to.deep.equal(t);
      expect(generateFieldStringStub.getCall(0).args[0]).to.deep.equal(f);
      expect(generateLineProtocolStringStub.getCall(0).args[0]).to.deep.equal({
        fields: 'a=b',
        tags: 'c=d',
        ts: ts,
        measurement: m
      });
    });
  });

});
