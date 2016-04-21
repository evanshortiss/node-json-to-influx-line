'use strict';

var util = require('./util')
  , inherits = require('util').inherits
  , Transform = require('stream').Transform;

/**
 * Stream that takes a JSON Object input and outputs it as line protocol
 * that is compatible with InfluxDB
 * @param {Object} opts
 */
function JsonInfluxLineStream (opts) {
  Transform.call(this, opts);

  // The stream expects input to be an object, and will also output objects
  this._writableState.objectMode = true;
  this._readableState.objectMode = true;

  this.opts = opts;
}
inherits(JsonInfluxLineStream, Transform);
module.exports = JsonInfluxLineStream;


/**
 * Transforms an input JSON Object to the line protocol format
 * @param  {Object}   data
 * @param  {String}   encoding
 * @param  {Function} done
 */
JsonInfluxLineStream.prototype._transform = function (data, encoding, done) {
  done(null, util.generateLineProtocolString({
    measurement: data.measurement,
    tags: util.generateTagString(data.tags),
    fields: util.generateFieldString(data.fields),
    ts: data.ts
  }));
};
