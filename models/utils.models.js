const db = require("../db/connection");
const fs = require("fs/promises");

exports.checkArticleExists = async (articleId) => {
  const {
    rows: [{ exists }],
  } = await db.query(
    `
    SELECT EXISTS (
        SELECT article_id FROM articles
        WHERE article_id = $1
    );`,
    [articleId]
  );
  if (!exists) {
    return Promise.reject({ status: 404, msg: "Article ID not found" });
  }
};

exports.checkTopicExists = async (topic) => {
  if (!topic) return;

  const {
    rows: [{ exists }],
  } = await db.query(
    `
  SELECT EXISTS (
    SELECT slug FROM topics
    WHERE slug = $1
  );`,
    [topic]
  );
  if (!exists) {
    return Promise.reject({ status: 404, msg: "Topic not found" });
  }
};

exports.fetchEndpoints = async () => {
  const endpoints = await fs.readFile("./endpoints.json", "utf-8");
  return JSON.parse(endpoints);
};
