const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createSchedule = {
  body: Joi.object().keys({
    db: Joi.string().required(),
    interval: Joi.string(),
    day: Joi.number(),
    hour: Joi.number()
  }),
};

const deleteScheduled = {
  params: Joi.object().keys({
    dbName: Joi.string().required()
  })
}

module.exports = {
  createSchedule,
  deleteScheduled
}