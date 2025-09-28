const config = require("../config/config")
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { mongoService } = require('../services');


/**
 * @brief List all databases
 */
const queryDatabases = catchAsync(async (req, res) => {
  const dbs = await mongoService.listDatabases();
  if (!dbs) {
    throw new ApiError(httpStatus.CONFLICT, 'Database connection error');
  }
  res.send(dbs);
});

/**
 * @brief Get database stats by db name
 */
const getDatabase = catchAsync(async (req, res) => {
  const db = await mongoService.getDatabase(req.params.dbName);
  if (!db) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, 'Database not found');
  }
  res.send(db)
});

module.exports = {
  queryDatabases,
  getDatabase
}