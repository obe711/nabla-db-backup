
const { spawn } = require('child_process');
const { uploadStream } = require('./spaces.service');
const { updateBackup } = require('./backup.service');
const config = require('../config/config');
const logger = require('../config/logger');


const createMongodump = async (backupDoc, host = null, port = null) => {
  if (!host) host = config.nabla.db_backup_host;
  if (!port) port = config.nabla.db_backup_port;

  const mongodump = spawn('mongodump', [`--db=${backupDoc.db}`, `--host=${host}`, `--port=${port}`, '--gzip', '--archive']);

  mongodump.stderr.on('data', function (data) {
    logger.info(`mongodump: ${data}`);
  });

  mongodump.on('exit', function (code) {
    if (code !== 0) {
      updateBackup(backupDoc._id, { status: 'failed' });
      logger.error("mongodump error");
      return;
    }
    logger.info('mongodump process complete');
  });

  try {
    await uploadStream(backupDoc.file, mongodump.stdout, config.s3.buckets.dbBackupBucket);
  } catch {
    updateBackup(backupDoc._id, { status: 'failed' });
    logger.error("aws error");
    return;
  }


  updateBackup(backupDoc._id, { status: 'completed' });
  logger.info(`backup completed - ${backupDoc.file}`);
  return;
}

module.exports = {
  createMongodump
}