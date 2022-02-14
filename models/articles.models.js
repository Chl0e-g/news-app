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
