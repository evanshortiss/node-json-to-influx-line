'use strict';

var util = require('./util');

exports.JsonInfluxDbStream = require('./converter');

/**
 * Conert an JSON Object to line protocol format.
 * @param  {Object} opts
 * @return {String}
 */
exports.convert = function convert (opts) {
  return util.generateLineProtocolString({
    measurement: opts.measurement,
    tags: util.generateTagString(opts.tags),
    fields: util.generateFieldString(opts.fields),
    ts: opts.ts
  });
};
