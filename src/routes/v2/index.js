const express = require('express');
const backupRoute = require('./backup.route');
const dbRoute = require("./db.route");
const scheduleRoute = require("./schedule.route")

const router = express.Router();

const defaultRoutes = [
  {
    path: '/backups',
    route: backupRoute,
  },
  {
    path: '/dbs',
    route: dbRoute,
  },
  {
    path: '/schedule',
    route: scheduleRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;