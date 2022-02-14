const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById } = require("./controllers/articles.controllers");
const {
  invalidPath,
  serverError,
  customErrors,
  invalidItemId,
} = require("./error-handlers/app.error-handlers");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

//error handlers
app.all("/*", invalidPath);
app.use(customErrors);
app.use(invalidItemId);
app.use(serverError);

module.exports = app;
