'use strict';

var expect = require('chai').expect;

describe('converter', function () {
  var Converter;

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
    Converter = require('converter.js');
  });

  it('should convert an input JSON string', function (done) {
    var c = new Converter();

    c.on('data', function (data) {
      expect(data.toString()).to.equal('test,tag=tagvalue field=fieldvalue');
      done();
    });

    c.write(testData, null);
  });
});
