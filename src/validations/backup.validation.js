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
};

module.exports = {
  createBackup,
  getBackups,
  getBackup,
  deleteBackup,
};