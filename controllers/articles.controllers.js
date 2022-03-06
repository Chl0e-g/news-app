const {
  fetchArticleById,
  updateArticleVotes,
  fetchArticles,
  insertArticle,
} = require("../models/articles.models");
const { checkTopicExists } = require("../models/utils.models");

exports.getArticleById = (req, res, next) => {
  const { article_id: articleId } = req.params;
  fetchArticleById(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleVotes = (req, res, next) => {
  const { article_id: articleId } = req.params;
  const { inc_votes: incVotes } = req.body;
  updateArticleVotes(articleId, incVotes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  const { sort_by: sortBy, order, topic } = req.query;

  Promise.all([fetchArticles(sortBy, order, topic), checkTopicExists(topic)])
    .then(([articles]) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postArticle = (req, res, next) => {
  const { author, title, body, topic } = req.body;
  insertArticle(author, title, body, topic)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
