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
