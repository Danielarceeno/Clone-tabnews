import crypto from "node:crypto";
import retry from "async-retry";
import database from "infra/database.js";
import migrator from "models/migrator.js";
import user from "models/user.js";
import session from "models/session.js";
import activation from "models/activation.js";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");

      if (response.status !== 200) {
        throw Error();
      }
    }
  }
}

async function clearDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runPendingMigrations() {
  await migrator.runPendingMigrations();
}

async function createUser(userObject) {
  const randomSuffix = crypto.randomBytes(8).toString("hex");

  return await user.create({
    username: userObject?.username || `user${randomSuffix}`,
    email: userObject?.email || `user${randomSuffix}@curso.dev`,
    password: userObject?.password || "validpassword",
  });
}

async function activateUser(userObject) {
  return await activation.activateUserByUserId(userObject.id);
}

async function createSession(userObject) {
  return await session.create(userObject.id);
}

async function addFeaturesToUser(userObject, features) {
  return await user.addFeatures(userObject.id, features);
}

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
  activateUser,
  createSession,
  addFeaturesToUser,
};

export default orchestrator;
