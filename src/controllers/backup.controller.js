const config = require("../config/config")
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { mongodumpService, backupService, spacesService, mongoService } = require('../services');

const createBackup = catchAsync(async (req, res) => {
  const backup = await backupService.createBackup(req.body);
  if (!backup) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Backup not created');
  }
  mongodumpService.createMongodump(backup);
  res.status(httpStatus.CREATED).send(backup);
});

const getBackups = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['user', 'ip', 'startDate', 'endDate']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search } = pick(req.query, ['search']);
  const result = await backupService.queryBackups(filter, options, search);
  res.send(result);
});

const getBackup = catchAsync(async (req, res) => {
  const backup = await backupService.getBackupById(req.params.backupId);
  if (!backup) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Backup not found');
  }

  const link = await spacesService.getFirmwareDownloadLink(config.s3.buckets.dbBackupBucket, backup.file)
  res.send({ link, file: backup.file });
});

// V2
const createBackupV2 = catchAsync(async (req, res) => {
  const dbBackupBody = pick(req.body, ['user', 'ip']);
  const dbStats = await mongoService.getDatabase(req.body.db);
  if (!dbStats) {
    throw new ApiError(httpStatus.CONFLICT, 'Database not found');
  }

  Object.assign(dbBackupBody, {
    ...dbStats?.meta,
    db: dbStats.db
  });

  const backup = await backupService.createBackup(dbBackupBody);
  if (!backup) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Backup not created');
  }

  mongodumpService.createMongodump(backup);
  res.status(httpStatus.CREATED).send(backup);
});


const getBackupsV2 = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['db', 'startDate', 'endDate']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const { search } = pick(req.query, ['search']);
  const result = await backupService.queryBackups(filter, options, search);
  res.send(result);
});


module.exports = {
  createBackup,
  getBackups,
  getBackup,
  createBackupV2,
  getBackupsV2
};
