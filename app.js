const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  patchArticleVotes,
} = require("./controllers/articles.controllers");
const { getUsers } = require("./controllers/users.controllers");
const {
  invalidPath,
  customErrors,
  invalidItemId,
  serverError,
} = require("./error-handlers/app.error-handlers");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);

app.get("/api/users", getUsers);

//error handlers
app.all("/*", invalidPath);
app.use(customErrors);
app.use(invalidItemId);
app.use(serverError);

module.exports = app;
