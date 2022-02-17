const db = require("../db/connection");

exports.fetchCommentsByArticleId = async (articleId) => {
  const { rows: comments } = await db.query(
    `
    SELECT * FROM comments
    WHERE article_id = $1;`,
    [articleId]
  );
  return comments;
};

exports.insertComment = async (articleId, author, body) => {
  const {
    rows: [comment],
  } = await db.query(
    `
  INSERT INTO comments
  (article_id, author, body)
  VALUES ($1, $2, $3)
  RETURNING *;`,
    [articleId, author, body]
  );
  return comment;
};

exports.removeComment = async (commentId) => {
  await db.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1;`,
    [commentId]
  );
  return;
};
