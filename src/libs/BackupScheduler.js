const { EventEmitter } = require('node:events');

const { scheduleService, mongoService, backupService, mongodumpService } = require("../services");
const { clearTimeout } = require('node:timers');

class BackupJob {
  constructor(scheduler, params) {
    this.scheduler = scheduler;
    this.id = params.id;
    this.db = params.db;
    this.day = params.day;
    this.hour = params.hour;
    this.interval = params.interval;
    this.nextBackup = params.nextBackup;

    this.targetDate = new Date(this.nextBackup);
    const now = new Date();
    this.ms = this.targetDate.getTime() - now.getTime();
    this.start();
  }

  start() {
    this.timeout = setTimeout(this._runJob, this.ms);
  }

  stop() {
    clearTimeout(this.timeout);
    // console.log("Scheduled backup paused");
  }

  /* Private */
  _runJob = async () => {
    try {
      await this._createBackup();
      this.scheduler.onComplete(this.db);
    } catch (err) {
      console.error(err);
    }
  }

  // created backup
  async _createBackup() {
    try {
      const dbStats = await mongoService.getDatabase(this.db);
      if (!dbStats) {
        console.error('Database not found', this.db)
      }

      const backup = await backupService.createBackup({
        ...dbStats?.meta,
        db: dbStats.db
      });
      if (!backup) {
        console.error('Backup not created')
        return;
      }
      mongodumpService.createMongodump(backup);
    } catch (err) {
      console.error(err)
    }
  }
}



class BackupScheduler extends EventEmitter {
  constructor() {
    super();
    this.map = new Map();
    this.error = false;
    console.log("BackupScheduler")
  }

  // create new job
  scheduleBackup(backup) {
    if (!backup?.db) {
      console.error("scheduleBackup - Missing backup ID");
      this.error = true;
      return;
    }
    const previousSchedule = this.map.get(backup.db);
    if (previousSchedule) {
      previousSchedule.job.stop();
    }
    const job = new BackupJob(this, backup);
    this.map.set(backup.db, { backup, job });
    console.log("Backup scheduled", backup.db, backup?.nextBackup)
  }

  // get all jobs
  getSchedule = () => {
    return Array.from([...this.map.values()]).map((job) => {
      return job?.backup;
    })
  }

  removeSchedule = (db) => {
    try {
      const scheduled = this.map.get(db);
      scheduled.job.stop();
      this.map.delete(db);
    } catch (err) { console.error(err) }
  }

  // Event callback
  onComplete = async (db) => {
    try {
      const completed = this.map.get(db);
      if (!completed) {
        console.error("Schedule not found:", id);
      }
      if (completed?.backup) {
        const { interval, day, hour } = completed.backup;
        // set new nextBackup date
        let nextBackup;
        if (interval === 'month') {
          nextBackup = new Date();
          nextBackup.setDate(nextBackup.getDate() + 30);
        } else {
          nextBackup = this.createTargetDate(interval, day, hour);
        }

        const updated = await scheduleService.updateByDb(db, { nextBackup })
        // schedule new job
        this.scheduleBackup(updated);
      }
    } catch (err) {
      console.error(err);
      this.error = true;
    }
  }

  // Init
  async load() {
    try {
      const schedules = await scheduleService.getAllSchedules();
      if (!schedules || schedules?.length < 1) {
        console.error("No schedules found");
        return this;
      }

      for (const backup of schedules) {
        this.scheduleBackup(backup);
      }
    } catch (err) {
      console.error(err);
      this.error = true;
    }

  }

  // static
  createTargetDate(interval, day, hour) {
    const now = new Date();
    const targetDate = new Date(now);
    let daysAway = 0;

    if (interval === "day") {
      if (now.getHours() >= hour) {
        daysAway = 1;
      }
    } else {
      const currentDay = now.getDay();

      if (currentDay <= day) {
        daysAway = day - currentDay;
      } else {
        daysAway = 7 - currentDay + day;
      }

      if (currentDay === day && now.getHours() < hour) {
        daysAway = 0;
      } else if (currentDay === day && now.getHours() >= hour) {
        daysAway = 7;
      }

    }

    targetDate.setDate(targetDate.getDate() + daysAway);
    targetDate.setHours(hour, 0, 0, 0);

    return targetDate;
  }
}

module.exports = BackupScheduler;