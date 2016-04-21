# JSON to InfluxDB Line Protocol
Module that will convert a JSON Object to the line protocol format for
InfluxDB. Will perform any necessary escaping on strings as specified by the
protocol. You can read about the InfluxDB line protocol [here](https://docs.influxdata.com/influxdb/v0.12/write_protocols/write_syntax/#line-protocol).

This module does not perform any I/O to InfluxDB. It is just a converter.

This is the initial version and has not been thoroughly tested in real world
scenarios, nor performance tested. A suite of unit tests are passing however.

# Install
```
npm i json-influxdb-line
```

# Usage

Any Object you want to convert to a line must be of the format:

```js
{
  measurement: 'name-of-measure',
  // Fields cannot contain sub-objects unless they are stringified
  fields: {
    c: '2',
    d: 3
  },
  // Options. Tags cannot contain sub-objects unless they are stringified
  tags: {
    a: '1',
    b: 2
  },
  // Optional. Any precision can be used (see InfluxDB API)
  ts: Date.now()
}
```

## Streaming
```js
var JsonInfluxDbStream = require('json-influxdb-line').JsonInfluxDbStream;

var jsonToLine = new JsonInfluxDBLineStream();

// Get JSON (stringified objects), convert to line format, write to influxdb
getJsonStream()
  .pipe(jsonToLine)
  .pipe(influxApiStream);
```

## Functional
```js
var convert = require('json-influxdb-line').convert;

// This will create a String with the contents:
// measurement-name,foo=bar value=15 1461108623664
var line = convert({
  // A measurement name
  measurement: 'measurement-name',

  // Optional tags. Nested objects are not supported
  tags: {
    foo: 'bar'
  },

  // Fields. Nested objects are not supported
  fields: {
    value: 15
  },

  // Timestamp - can be omitted
  ts: Date.now()
});
```

# Contributions
All are welcome, just open a Pull Request and add tests where necessary.
