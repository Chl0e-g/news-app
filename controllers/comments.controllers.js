const {
  fetchCommentsByArticleId,
  insertComment,
  removeComment,
  updateCommentVotes,
} = require("../models/comments.models");
const { checkArticleExists } = require("../models/utils.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id: articleId } = req.params;

  Promise.all([
    fetchCommentsByArticleId(articleId),
    checkArticleExists(articleId),
  ])
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id: articleId } = req.params;
  const { username: author, body } = req.body;
  insertComment(articleId, author, body)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id: commentId } = req.params;

  removeComment(commentId)
    .then(() => {
      res.sendStatus(204);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchCommentVotes = (req, res, next) => {
  const { comment_id: commentId } = req.params;
  const { inc_votes: incVotes } = req.body;

  updateCommentVotes(commentId, incVotes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
