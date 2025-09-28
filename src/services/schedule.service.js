const { Schedule } = require('../models');

const createSchedule = (body) => {
  return Schedule.findOneAndUpdate({ db: body.db }, body, { upsert: true, new: true });
}

const getAllSchedules = () => {
  return Schedule.find({})
}

const updateById = (id, update) => {
  return Schedule.findByIdAndUpdate(id, update, { new: true })
}

const getByName = (db) => {
  return Schedule.findOne({ db });
}

const deleteByName = (db) => {
  return Schedule.deleteOne({ db });
}

module.exports = {
  createSchedule,
  getAllSchedules,
  updateById,
  getByName,
  deleteByName
}