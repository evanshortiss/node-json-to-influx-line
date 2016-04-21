'use strict';


var SPACE_REPLACER = [new RegExp(' ', 'gi'), '\\ '];
var COMMA_REPLACER = [new RegExp(',', 'gi'), '\\,'];
var EQUAL_REPLACER = [new RegExp('=', 'gi'), '\\='];

var FIELD_TAG_REPLACERS = [
  SPACE_REPLACER,
  COMMA_REPLACER,
  EQUAL_REPLACER
];

var MEASURE_REPLACERS = [
  SPACE_REPLACER,
  COMMA_REPLACER
];


/**
 * Certain chars need to be escaped for certain string portions.
 * This function will escape the required items for a given input string
 *
 * @param  {Array}  replacers
 * @param  {String} input
 * @return {String}
 */
function escapeChars (replacers, input) {
  for (var r in replacers) {
    input = input.replace(replacers[r][0], replacers[r][1]);
  }

  return input;
}


/**
 * Creates a tag or value string that can be incldued in a complete InfluxDB
 * line protocol string
 * @param  {Array}  keys
 * @param  {Object} data
 * @return {String}
 */
exports.generateTagString = function (data, keys) {
  var ret = '';

  // Keys can be provided. If not we assume all keys are required
  keys = keys || Object.keys(data);

  if (keys.length > 0) {
    for (var i in keys) {
      ret +=
        escapeChars(FIELD_TAG_REPLACERS, keys[i]) +
        '=' +
        escapeChars(FIELD_TAG_REPLACERS, data[keys[i]]) +
        ',';
    }

    ret = ret.slice(0, -1);
  }

  return ret;
};


/**
 * Creates a string of field values
 * @param  {Array}  keys
 * @param  {Object} data
 * @return {String}
 */
exports.generateFieldString = function (data, keys) {
  var ret = '';

  // Keys can be provided. If not we assume all keys are required
  keys = keys || Object.keys(data);

  if (keys.length > 0) {
    for (var i in keys) {
      ret += escapeChars(FIELD_TAG_REPLACERS, keys[i]) +
        '=' +
        data[keys[i]] +
        ',';
    }

    ret = ret.slice(0, -1);
  }

  return ret;
};


/**
 * Generates a line protocol string from provided inputs
 * @param  {String} m  measurement name
 * @param  {String} t  tags
 * @param  {String} f  fields
 * @param  {String} ts [timestamp]
 * @return {String}
 */
exports.generateLineProtocolString = function (params) {
  // timestamp is optional
  if (params.ts) {
    params.ts = ' ' + params.ts;
  } else {
    params.ts = '';
  }

  // tags are also optional, but we need to pad accordingly if they're missing
  if (params.tags && params.tags.length !== 0) {
    params.tags = ',' + params.tags;
  } else {
    params.tags = '';
  }

  return (
    escapeChars(MEASURE_REPLACERS, params.measurement) +
    params.tags +
    ' ' +
    params.fields +
    params.ts
  );
};
