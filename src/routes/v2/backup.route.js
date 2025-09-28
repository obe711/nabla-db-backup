const express = require('express');
const auth = require('../../middlewares/nablaAuth');
const validate = require('../../middlewares/validate');
const backupValidation = require('../../validations/backup.validation');
const backupController = require('../../controllers/backup.controller');

const router = express.Router();

router
  .route('/')
  .post(auth(), validate(backupValidation.createBackupV2), backupController.createBackupV2)
  .get(auth(), validate(backupValidation.getBackupsV2), backupController.getBackupsV2);

router
  .route('/:backupId')
  .get(auth(), validate(backupValidation.getBackup), backupController.getBackup);

module.exports = router;