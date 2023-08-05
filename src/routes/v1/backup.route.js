const express = require('express');
const auth = require('../../middlewares/nablaAuth');
const validate = require('../../middlewares/validate');
const backupValidation = require('../../validations/backup.validation');
const backupController = require('../../controllers/backup.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(backupValidation.createBackup), backupController.createBackup)
  .get(auth(), validate(backupValidation.getBackups), backupController.getBackups);

router
  .route('/:backupId')
  .get(auth(), backupController.getBackup);

module.exports = router;