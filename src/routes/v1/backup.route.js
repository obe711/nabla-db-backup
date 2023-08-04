const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const backupValidation = require('../../validations/backup.validation');
const backupController = require('../../controllers/backup.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(backupValidation.createBackup), backupController.createBackup)
  .get(validate(backupValidation.getBackups), backupController.getBackups);

router
  .route('/:backupId')
  .get(backupController.getBackup);

module.exports = router;