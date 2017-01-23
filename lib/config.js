var fs = require('fs');
var JSV = require('JSV').JSV;
var schema = require('../conf/env.schema.json');
var demoConf = require.resolve('../conf/env.json.dist');

function processConf(config, teardown) {

  var configValidationReport = JSV.createEnvironment().validate(config, schema);

  // Validate env.json based on env.schema.json
  if (configValidationReport.errors.length > 0) {
    if (teardown) {
      console.error('env.json is invalid');
      console.error(configValidationReport.errors);
      process.exit(1);
    } else {
      throw new Error(configValidationReport.errors);
    }
  }

  return config;
}

module.exports = {
  loadFromEnv: function () {
    var config = {
      "store": "sql",
      "sql": {
        "connectionString": process.env.DATABASE_URL
      },
      "allowedOrigin": null,
      "port": parseInt(process.env.PORT || 2600, 10),
      "domainWhitelist": process.env.DOMAIN_WHITELIST_STRING.split(','),
      "sourceBlacklist": process.env.SOURCE_BLACKLIST_STRING.split(',')
    }

    return processConf(config, true);
  },
  set: function (config) {
    return processConf(config, false);
  },
  dropExample: function (confPath) {
    fs.createReadStream(demoConf).pipe(fs.createWriteStream(confPath));
  }
};
