const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { invalidPath } = require("./error-handlers/app.error-handlers");

const app = express();

app.get("/api/topics", getTopics);

app.all("/*", invalidPath);

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;
