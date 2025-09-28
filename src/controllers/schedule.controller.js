const config = require("../config/config")
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { mongoService, scheduleService } = require("../services");

const { backupScheduler } = require("../libs");


const createSchedule = catchAsync(async (req, res) => {
  const found = await mongoService.getDatabase(req.body.db);
  if (!found) {
    throw new ApiError(httpStatus.CONFLICT, "Database not found");
  }

  const options = pick(req.body, ["interval", "day", "hour"])
  const newTargetDate = backupScheduler.createTargetDate(options.interval, options.day, options.hour);
  const record = await scheduleService.createSchedule({
    db: found.db,
    ...options,
    nextBackup: newTargetDate
  })

  backupScheduler.scheduleBackup(record);
  res.send({
    newTargetDate, db: found.db,
    record,
  })
})

const getScheduled = catchAsync(async (req, res) => {
  const scheduled = await scheduleService.getAllSchedules();
  res.send({ scheduled })
})

const deleteScheduled = catchAsync(async (req, res) => {
  const scheduled = await scheduleService.deleteByName(req.params.dbName);
  res.send({ scheduled })
})


module.exports = {
  createSchedule,
  getScheduled,
  deleteScheduled
}