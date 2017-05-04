/*jslint node: true */
/*jshint -W030 */
"use strict";

const changeCase = require('change-case');

/**
 * Expose `Config` constructor
 * @param {Mixed} defaultConfig Default configuration
 */
function Config(defaultConfig) {
  this.conf = Object.assign({}, defaultConfig);
}

/**
 * Init a configuration object
 * @param {Array} array of hierarchical asc ordered properties
 * @param {Object} value of property
 * @param {Object} [conf] default conf
 * @return {Config} The conf object
 * @api public
 */
Config.prototype.init = function (array, value, conf) {

  conf = conf || this.conf;

  const singlePropNameCamelCase = changeCase.camelCase(array[0]);
  // Last property in hierarchy
  if (array && array.length === 1 && conf.hasOwnProperty(singlePropNameCamelCase)) {
    conf[singlePropNameCamelCase] = value;
  } else if (array && array.length > 1) {
    const combinedPropNameCamelCase = changeCase.camelCase(array.join(' '));

    if (combinedPropNameCamelCase && conf.hasOwnProperty(combinedPropNameCamelCase)) {
      conf[combinedPropNameCamelCase] = value;
    }

    this.init(array.slice(1), value, conf[singlePropNameCamelCase]);
  }

};

/**
 * Extends a configuration object
 * @param {Array} array of hierarchical asc ordered properties
 * @param {Object} value of property
 * @param {Object} [conf] default conf
 * @return {Config} The conf object
 * @api public
 */
Config.prototype.extend = function (array, value, conf) {

  conf = conf || this.conf;
  let propName = null;

  // Last property in hierarchy
  if (array && array.length === 1) {
    conf[changeCase.camelCase(array[0])] = value;
  } else if (array && array.length > 1) {
    propName = array[0];
    propName = changeCase.camelCase(propName);
    // if object is not on conf. hierarchy
    if (array[0] && conf[propName] === undefined) {
      conf[propName] = {};
    }
    this.extend(array.slice(1), value, conf[propName]);
  }

};

module.exports = Config;
