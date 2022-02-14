const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  invalidPath,
  serverError,
} = require("./error-handlers/app.error-handlers");

const app = express();

app.get("/api/topics", getTopics);

app.all("/*", invalidPath);

app.use(serverError);

module.exports = app;
