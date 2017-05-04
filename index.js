/*jslint node: true */
/*global process */
/*jshint -W030 */
"use strict";

const Config = require('./lib/config'),
  changeCase = require('change-case');

module.exports = function (config) {
  const defaults = {
    prefix: '',
    arraySeparator: null,
    defaults: {},
    addAdditionalFields: true
  };

  let i, prefixCC, env, value, configuration, hierarchy = [];

  const conf = {};

  // Extend defaults with user configuration
  conf.prefix = (config && config.prefix) ? config.prefix : defaults.prefix;
  conf.arraySeparator = (config && config.arraySeparator) ? config.arraySeparator : defaults.arraySeparator;
  conf.defaults = (config && config.defaults) ? config.defaults : defaults.defaults;
  conf.addAdditionalFields = (config && (typeof config.addAdditionalFields !== 'undefined') &&
  (config.addAdditionalFields !== null)) ? config.addAdditionalFields : defaults.addAdditionalFields;

  // Namespace (prefix) for config env variables
  prefixCC = changeCase.constantCase(conf.prefix);
  // Create config object
  configuration = new Config(conf.defaults);
  // Iterate over env vars
  for (env in process.env) {
    // if env is in app namespace
    if (changeCase.constantCase(env).indexOf(prefixCC) === 0) {
      const prefixLen = prefixCC.length;
      // split each const using separator
      hierarchy = env.substr(prefixLen ? prefixLen + 1 : 0).split('_');

      // Array property ?
      if (conf.arraySeparator && process.env[env].indexOf(conf.arraySeparator) !== -1) {
        value = process.env[env].split(conf.arraySeparator);
        // Try to parse each element in array
        for (i = 0; i < value.length; i = i + 1) {
          try {
            value[i] = JSON.parse(value[i]);
          } catch (error) {
            // Do not parse string values
            // Remove leading and traling spaces
            if (typeof value[i] === 'string') {
              value[i] = value[i].trim();
            }
          }
        }
      } else {
        try {
          value = JSON.parse(process.env[env]);
        } catch (error) {
          /* Do not parse value */
          value = process.env[env];
        }
      }
      if (conf.addAdditionalFields) {
        configuration.extend(hierarchy, value);
      } else {
        configuration.init(hierarchy, value);
      }
    }
  }
  return configuration.conf;

};
