const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const scheduleSchema = mongoose.Schema(
  {
    db: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    interval: {
      type: String,
      enum: ['day', 'week', 'month'],
      required: true,
    },
    // if week or month
    day: {
      type: Number,
      min: 0, // sun
      max: 6, // sat
      required: true,
    },
    // if day, week, or month
    hour: {
      type: Number,
      min: 0,  // 12 AM
      max: 23, // 11 PM
      required: true,
    },
    nextBackup: {
      type: Date,
      required: true
    },
    lastBackup: {
      type: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

scheduleSchema.plugin(toJSON);

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
scheduleSchema.statics.searchableFields = function () {
  return ['db'];
};


scheduleSchema.virtual('ms').get(function () {
  const now = new Date();
  const targetDate = new Date(this.nextBackup);

  return targetDate.getTime() - now.getTime();
});

/**
 * @typedef Schedule
 */
const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;