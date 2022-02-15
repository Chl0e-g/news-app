const {
  fetchArticleById,
  updateArticleVotes,
  fetchArticles
} = require("../models/articles.models");

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
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
