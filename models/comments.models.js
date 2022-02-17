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
  //error handling: invalid commentId
  if (!Number.isInteger(+commentId)) {
    return Promise.reject({ status: 400, msg: "Invalid comment ID" });
  }

  const { rowCount } = await db.query(
    `
  DELETE FROM comments
  WHERE comment_id = $1;`,
    [commentId]
  );

  //error handling: commentId not found
  if (rowCount === 0) {
    return Promise.reject({ status: 404, msg: "Comment ID not found" });
  }

  return;
};
