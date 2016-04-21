'use strict';

var expect = require('chai').expect
  , invert = require('lodash.invert')
  , util = require('util.js');

describe('util', function () {
  var SAMPLES = {
    SINGLE: {
      'key': 'value'
    },
    DUAL: {
      'key': 'value',
      'a': 'b'
    },
    COMPLEX: {
      'key': 'v=alue',
      'a': 'b,"c"',
      'd': 'e f'
    }
  };

  var ts = Date.now();

  describe('#generateTagString', function () {
    it('should generate a string with a single tag', function () {
      expect(
        util.generateTagString(SAMPLES.SINGLE)
      ).to.equal('key=value');
    });

    it('should generate a string of comma separated tags', function () {
      expect(
        util.generateTagString(SAMPLES.DUAL)
      ).to.equal('key=value,a=b');
    });

    it('should generate a filtered string ', function () {
      expect(
        util.generateTagString(SAMPLES.DUAL, ['key'])
      ).to.equal('key=value');
    });

    it('should escape equal, comma, and space for keys and vals', function () {
      expect(
        util.generateTagString(SAMPLES.COMPLEX)
      ).to.equal('key=v\\=alue,a=b\\,"c",d=e\\ f');
    });
  });

  describe('#generateFieldString', function () {
    it('should generate a single field with value', function () {
      expect(
        util.generateFieldString(SAMPLES.SINGLE)
      ).to.equal('key=value');
    });

    it('should generate two fields', function () {
      expect(
        util.generateFieldString(SAMPLES.DUAL)
      ).to.equal('key=value,a=b');
    });

    it('should not perform any escaping', function () {
      expect(
        util.generateFieldString(SAMPLES.COMPLEX)
      ).to.equal('key=v=alue,a=b,"c",d=e f');
    });

    it('should generate a filtered string ', function () {
      expect(
        util.generateFieldString(SAMPLES.DUAL, ['key'])
      ).to.equal('key=value');
    });

    it('should escape equal, comma, and space for keys only', function () {
      expect(
        util.generateFieldString(invert(SAMPLES.COMPLEX))
      ).to.equal('v\\=alue=key,b\\,"c"=a,e\\ f=d');
    });
  });

  describe('#generateLineProtocolString', function () {
    it(
      'should create a line with tags and fields string minus timestamp',
      function () {
        expect(
          util.generateLineProtocolString({
            measurement: 'test',
            tags: 'tag=tagvalue',
            fields: 'field=fieldvalue'
          })
        ).to.equal('test,tag=tagvalue field=fieldvalue');
      }
    );

    it('should create a line string with all fields', function () {
      expect(
        util.generateLineProtocolString({
          measurement: 'test',
          tags: 'tag=tagvalue',
          fields: 'field=fieldvalue',
          ts: ts
        })
      ).to.equal('test,tag=tagvalue field=fieldvalue ' + ts);
    });

    it('should create a line string without tags or timestamp', function () {
      expect(
        util.generateLineProtocolString({
          measurement: 'test',
          fields: 'field=fieldvalue'
        })
      ).to.equal('test field=fieldvalue');
    });

    it('should create a line string without tags', function () {
      expect(
        util.generateLineProtocolString({
          measurement: 'test',
          fields: 'field=fieldvalue',
          ts: ts
        })
      ).to.equal('test field=fieldvalue ' + ts);
    });
  });

});
