const db = require("../db/connection");

exports.checkArticleExists = async (articleId) => {
  const {
    rows: [{ exists }],
  } = await db.query(
    `
    SELECT EXISTS (
        SELECT article_id FROM articles
        WHERE article_id = $1
    )`,
    [articleId]
  );
  if (!exists) {
    return Promise.reject({ status: 404, msg: "Article ID not found" });
  }
};
