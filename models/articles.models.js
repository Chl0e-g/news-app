const db = require("../db/connection");

exports.fetchArticleById = async (articleId) => {
  const {
    rows: [article],
  } = await db.query(
    `
    SELECT * FROM articles
    WHERE article_id = $1;`,
    [articleId]
  );

  //error handling: no article found
  if (!article) {
    return Promise.reject({ status: 404, msg: "Item ID not found" });
  }
  
  return article;
};

exports.updateArticleVotes = async (articleId, incVotes) => {
  //error handling: no incVotes
  if (!incVotes) {
    return Promise.reject({
      status: 400,
      msg: "Missing inc_votes data in request body",
    });
  }

  //error handling: invalid incVotes
  if (!Number.isInteger(incVotes)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid inc_votes data in request body",
    });
  }

  const {
    rows: [updatedArticle],
  } = await db.query(
    `
    UPDATE articles
    SET votes = votes + $2
    WHERE article_id = $1
    RETURNING *;`,
    [articleId, incVotes]
  );

  //error handling: no article found
  if (!updatedArticle) {
    return Promise.reject({ status: 404, msg: "Item ID not found" });
  }

  return updatedArticle;
};
