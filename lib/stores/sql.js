var sequelize = require('sequelize');
var Report = require('../report');

module.exports = function (config) {
  var sequelizeDB = new sequelize(config.sql.connectionString);

  // Authenticate and connect to DB
  sequelizeDB
    .authenticate()
    .complete(function (err) {
      if (!!err) {
        console.log('Unable to connect to the database.');
      } else {
        console.log('Connection has been established successfully.');
      }
    });

  // Define schema
  var cspViolation = sequelizeDB.define('cspViolation', Report.prototype.getSQLDefinition(sequelize));

  // Create table
  sequelizeDB.sync({}).complete(function (err) {
    if (!!err) {
      console.log('ERROR: An error occurred while creating the table.', JSON.stringify(err, null, 2));
    } else {
      console.log('Table created.');
    }
  });

  function storeViolation(report) {
    // Directly create record in DB
    cspViolation.create(report.getRaw()).complete(function () {
      console.log('Violation stored.');
    });
  }
  return {
    save: storeViolation
  };
};
