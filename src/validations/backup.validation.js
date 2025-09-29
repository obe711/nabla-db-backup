const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBackup = {
  body: Joi.object().keys({
    db: Joi.string().required(),
    user: Joi.string().custom(objectId),
    ip: Joi.string().required(),
    userCount: Joi.number().integer(),
    dbSize: Joi.number().integer(),
    recordCount: Joi.number().integer(),
    collectionCount: Joi.number().integer()
  }),
};

const getBackups = {
  query: Joi.object().keys({
    user: Joi.string().custom(objectId),
    ip: Joi.string(),
    startDate: Joi.string().allow(''),
    endDate: Joi.string().allow(''),
    search: Joi.string().allow(''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getBackup = {
  params: Joi.object().keys({
    backupId: Joi.string().custom(objectId),
  }),
};


const deleteBackup = {
  params: Joi.object().keys({
    backupId: Joi.string().custom(objectId),
  }),
  query: Joi.object().keys({
    file: Joi.string().optional()
  })
};

// V2

const getDatabaseByName = {
  params: Joi.object().keys({
    dbName: Joi.string().required()
  })
}

const createBackupV2 = {
  body: Joi.object().keys({
    db: Joi.string().required(),
    user: Joi.string().custom(objectId),
    ip: Joi.string().default("localhost")
  }),
};

const getBackupsV2 = {
  query: Joi.object().keys({
    db: Joi.string().allow(''),
    startDate: Joi.string().allow(''),
    endDate: Joi.string().allow(''),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

module.exports = {
  createBackup,
  getBackups,
  getBackup,
  deleteBackup,
  // V2
  createBackupV2,
  getDatabaseByName,
  getBackupsV2
};