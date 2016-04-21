'use strict';

var util = require('./util')
  , safejson = require('safejson')
  , inherits = require('util').inherits
  , Transform = require('stream').Transform;

/**
 * Stream that takes a JSON Object input and outputs it as line protocol
 * that is compatible with InfluxDB
 * @param {Object} opts
 */
function JsonInfluxLineStream (opts) {
  Transform.call(this, opts);
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
  safejson.parse(data, function onJsonParse (err, data) {
    if (err) {
      done(err);
    } else {
      done(null, util.generateLineProtocolString(data));
    }
  });
};
