const express = require("express");
const { getEndpoints } = require("./controllers/utils.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  patchArticleVotes,
  getArticles, postArticle
} = require("./controllers/articles.controllers");
const {
  getUsers,
  getUserByUsername,
} = require("./controllers/users.controllers");
const {
  invalidPath,
  customErrors,
  psqlErrors,
  serverError,
} = require("./error-handlers/app.error-handlers");
const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
  patchCommentVotes,
} = require("./controllers/comments.controllers");

const app = express();
app.use(express.json());

app.get("/api", getEndpoints);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);
app.patch("/api/articles/:article_id", patchArticleVotes);
app.get("/api/articles", getArticles);
app.post("/api/articles", postArticle);

app.get("/api/users/:username", getUserByUsername);
app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteComment);
app.patch("/api/comments/:comment_id", patchCommentVotes);

//error handlers
app.all("/*", invalidPath);
app.use(customErrors);
app.use(psqlErrors);
app.use(serverError);

module.exports = app;
