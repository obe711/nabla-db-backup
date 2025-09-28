const logger = require('../config/logger');
const mongoose = require("mongoose")

const getDbInfo = async (dbName) => {
  // Verify DB exists
  const { databases } = await mongoose.connection.listDatabases();
  console.log(databases)
}

const listDatabases = async () => {
  try {
    const { databases } = await mongoose.connection.listDatabases();
    return databases;
  } catch (err) {
    logger.error(`List Databases: ${err.message}`);
    return []
  }
}

const getDatabase = async (dbName) => {
  try {
    const dbs = await listDatabases();
    const found = dbs.find((db) => db.name?.toLowerCase() === dbName.toLowerCase());
    if (!found) return null;

    const db2 = mongoose.connection.useDb(found.name, { useCache: true });

    const stats = await db2.db.stats();
    if (!stats) return null;

    const collections = await db2.listCollections();
    const foundUserCollection = collections.find(c => c.name === "users");
    let userCount = 0;
    if (foundUserCollection) {
      const Users = db2.collection("users");
      userCount = await Users.estimatedDocumentCount();
    }

    Object.assign(stats, {
      meta: {
        userCount,
        dbSize: stats.dataSize,
        recordCount: stats.objects,
        collectionCount: stats.collections
      }
    });
    return stats
  } catch (err) {
    logger.error(`Get Database: ${err.message}`);
    return null;
  }
}

module.exports = {
  getDbInfo,
  listDatabases,
  getDatabase
}