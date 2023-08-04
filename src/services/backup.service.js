const httpStatus = require('http-status');
const { Backup } = require('../models');
const ApiError = require('../utils/ApiError');
const mongoose = require('mongoose');
const Admin = mongoose.mongo.Admin;


const createBackup = async (backupBody) => {
  Object.assign(backupBody, { file: `${backupBody.db}.${Date.now()}` })
  return Backup.create(backupBody);
}

/**
 * Query for backups
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @param {string} search - Text string to search in search fields
 * @returns {Promise<QueryResult>}
 */
const queryBackups = async (filter, options, search) => {
  const backups = await Backup.paginate(filter, options, search);
  return backups;
};

const getBackupById = (backupId) => {
  return Backup.findById(backupId);
}


const updateBackup = async (backupId, updateBody) => {
  const updated = await Backup.findByIdAndUpdate(backupId, updateBody, { new: true });
  return updated;
}

module.exports = {
  createBackup,
  updateBackup,
  queryBackups,
  getBackupById
}