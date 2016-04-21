'use strict';

var expect = require('chai').expect
  , sinon = require('sinon')
  , proxyquire = require('proxyquire');

describe('converter', function () {
  var Converter, jsonStub;

  var testData = {
    measurement: 'test',
    tags: {
      tag: 'tagvalue'
    },
    fields: {
      field: 'fieldvalue'
    }
  };

  beforeEach(function () {
    jsonStub = sinon.stub();

    Converter = proxyquire('converter.js', {
      'safejson': {
        parse: jsonStub
      }
    });
  });

  it('should convert an input JSON string', function (done) {
    var c = new Converter();

    jsonStub.callsArgWith(1, null, testData);

    c.on('data', function (data) {
      expect(data.toString()).to.equal('test,tag=tagvalue field=fieldvalue');
      done();
    });

    c.write(JSON.stringify(testData));
  });

  it('should emit an error due to invalid JSON string', function (done) {
    var c = new Converter();

    jsonStub.callsArgWith(1, new Error('oops'), null);

    c.on('error', function () {
      done();
    });

    c.write(JSON.stringify({
      measurement: 'test',
      tags: 'tag=tagvalue',
      fields: 'field=fieldvalue'
    }));
  });
});
