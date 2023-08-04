const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const backupSchema = mongoose.Schema(
  {
    file: {
      type: String,
      required: true,
      trim: true,
    },
    db: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    ip: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
    },
    userCount: {
      type: Number,
      default: 0,
    },
    dbSize: {
      type: Number,
      default: 0,
    },
    recordCount: {
      type: Number,
      default: 0,
    },
    collectionCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
    }
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
backupSchema.plugin(toJSON);
backupSchema.plugin(paginate);

/**
 * Return paths to text search in paginate plugin
 * @returns {Array<string>}
 */
backupSchema.statics.searchableFields = function () {
  return ['ip', 'file'];
};

backupSchema.pre('save', async function (next) {
  const backup = this;
  if (backup.isNew) {
    backup.status = 'pending';
  }
  next();
});


/**
 * @typedef Backup
 */
const Backup = mongoose.model('Backup', backupSchema);

module.exports = Backup;