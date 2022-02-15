const db = require("../db/connection");

exports.fetchArticleById = async (articleId) => {
  const articleData = db.query(
    `
    SELECT * FROM articles
    WHERE articles.article_id = $1`,
    [articleId]
  );
  const commentCount = db.query(`
  SELECT COUNT(*)::int AS comment_count 
  FROM comments
  WHERE comments.article_id = $1`,
  [articleId])

  const [{rows: [article]}, {rows: [{comment_count}]}] = await Promise.all([articleData, commentCount])

  
  //error handling: no article found
  if (!article) {
    return Promise.reject({ status: 404, msg: "Item ID not found" });
  }
  
  //adding comment_count to article object
  article.comment_count = comment_count
  
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

exports.fetchArticles = async () => {
  const { rows: articles } = await db.query(`
  SELECT 
  author, title, article_id, topic, created_at, votes
  FROM articles
  ORDER BY created_at DESC`);
  return articles;
};
