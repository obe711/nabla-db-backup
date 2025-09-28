const express = require('express');
const auth = require('../../middlewares/nablaAuth');
const validate = require('../../middlewares/validate');
const backupValidation = require('../../validations/backup.validation');
const dbController = require('../../controllers/db.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), dbController.queryDatabases);

router
  .route('/:dbName')
  .get(auth(), validate(backupValidation.getDatabaseByName), dbController.getDatabase)

module.exports = router;