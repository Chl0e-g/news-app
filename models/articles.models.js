const db = require("../db/connection");

exports.fetchArticleById = async (article_id) => {
  const {
    rows: [article],
  } = await db.query(
    `
    SELECT * FROM articles
    WHERE article_id = $1;`,
    [article_id]
  );
  if (!article) {
    return Promise.reject({ status: 404, msg: "Item ID not found" });
  }
  return article;
};

exports.updateArticleVotes = async (article_id, inc_votes) => {
  const {
    rows: [updatedArticle],
  } = await db.query(
    `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,
    [article_id, inc_votes]
  );
  return updatedArticle;
};
