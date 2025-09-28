const express = require('express');
const auth = require('../../middlewares/nablaAuth');
const validate = require('../../middlewares/validate');
const scheduleValidation = require('../../validations/schedule.validation');
const scheduleController = require('../../controllers/schedule.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(scheduleValidation.createSchedule), scheduleController.createSchedule)
  .get(auth(), scheduleController.getScheduled);

router
  .route('/:dbName')
  .delete(auth(), validate(scheduleValidation.deleteScheduled), scheduleController.deleteScheduled);

module.exports = router;