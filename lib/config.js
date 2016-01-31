'use strict';

let fs = require('fs');
let JSON5 = require('json5');

class JsConfig {

  constructor(path) {
    this.loadSync(path);
  }

  loadSync(path) {
    this._config = JSON5.parse(fs.readFileSync(path));
  }

  get(key) {
    return this._config[key];
  }

}

module.exports = JsConfig;
