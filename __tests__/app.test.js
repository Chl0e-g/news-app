const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => db.end());
beforeEach(() => seed(data));

describe("Invalid endpoint error", () => {
  test("status: 404 - msg 'Path not found' for invalid endpoint", () => {
    return request(app)
      .get("/api/invalid-path")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});

describe("/api/topics", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of topic objects", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(Array.isArray(topics)).toBe(true);
          expect(topics).toHaveLength(3);
        });
    });
    test("status: 200 - topic objects in response have 'slug' and 'description' properties with string values", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  describe("GET", () => {
    test("status: 200 - responds with a single article object with matching article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(typeof article).toBe("object");
          expect(article.article_id).toBe(1);
        });
    });
    test("status: 200 - article object in response has these properties: author, title, article_id, body, topic, created_at, votes", () => {
      const article1 = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 100,
        comment_count: 11,
      };
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(article1);
        });
    });
    test("status: 200 - article object in response has comment_count property equal to the number of comments associated with that article_id", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).toBe(11);
        });
    });
    test("status: 200 - comment_count property is equal to zero if no comments are associated with that article_id", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.comment_count).toBe(0);
        });
    });
    test("status: 404 - msg 'Article ID not found' for valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article ID not found");
        });
    });
    test("status: 400 - msg 'Invalid article ID' for invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid article ID");
        });
    });
  });
  describe("PATCH", () => {
    test("status: 200 - increments votes for specified article in database by positive integer passed in request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(200)
        .then(() => {
          return request(app).get("/api/articles/1").expect(200);
        })
        .then(({ body: { article } }) => {
          expect(article.votes).toBe(110);
        });
    });
    test("status: 200 - decrements votes for specified article in database by negative integer passed in request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(() => {
          return request(app).get("/api/articles/1").expect(200);
        })
        .then(({ body: { article } }) => {
          expect(article.votes).toBe(90);
        });
    });
    test("status: 200 - responds with a single object showing the updated article", () => {
      const article1Updated = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 200,
      };
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 100 })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(article1Updated);
        });
    });
    test("status: 200 - additional data in request body is ignored", () => {
      const article1Updated = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: expect.any(String),
        votes: 200,
      };
      return request(app)
        .patch("/api/articles/1")
        .send({
          inc_votes: 100,
          superfluousData: "Test data",
          article_id: "superfluous data",
        })
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(article1Updated);
        });
    });
    test("status: 400 - msg 'Missing inc_votes data in request body' for request without inc_votes key in body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing inc_votes data in request body");
        });
    });
    test("status: 400 - msg 'Invalid inc_votes data in request body' for request with invalid inc_votes data type", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "invalid data" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid inc_votes data in request body");
        });
    });
    test("status: 404 - msg 'Article ID not found' for valid but non-existent article_id", () => {
      return request(app)
        .patch("/api/articles/999999")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article ID not found");
        });
    });
    test("status: 400 - msg 'Invalid article ID' for invalid article_id", () => {
      return request(app)
        .patch("/api/articles/invalid_id")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid article ID");
        });
    });
  });
});

describe("/api/articles", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(Array.isArray(articles)).toBe(true);
          expect(articles).toHaveLength(12);
        });
    });
    test("status: 200 - article objects in response have these properties: author, title, article_id, topic, created_at, votes", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 200 - article objects in response have comment_count property equal to the number of comments associated with that article_id", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_count: expect.any(Number),
              })
            );
            if (article.article_id === 1) {
              expect(article.comment_count).toBe(11);
            }
            if (article.article_id === 2) {
              expect(article.comment_count).toBe(0);
            }
          });
        });
    });
    test("status: 200 - article objects in response do not have a body property (this exists in the articles table in the database)", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          articles.forEach((article) => {
            expect(article).not.toHaveProperty("body");
          });
        });
    });
    test("status: 200 - article objects in response are sorted by created_at date in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of user objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(Array.isArray(users)).toBe(true);
          expect(users).toHaveLength(4);
        });
    });
    test("status: 200 - user objects in response have 'username' property with string value", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          users.forEach((user) => {
            expect(user).toEqual(
              expect.objectContaining({
                username: expect.any(String),
              })
            );
          });
        });
    });
    test("status: 200 - user objects in response do not contain any other properties from the users table in the database", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          users.forEach((user) => {
            expect(user).not.toHaveProperty("name");
            expect(user).not.toHaveProperty("avatar_url");
          });
        });
    });
  });
});

describe("/api/articles/:article_id/comments", () => {
  describe("GET", () => {
    test("status: 200 - responds with an array of comment objects for the specified article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(Array.isArray(comments)).toBe(true);
          expect(comments).toHaveLength(11);
        });
    });
    test("status: 200 - comment objects in response have these properties: comment_id, votes, created_at, author, body", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
              })
            );
          });
        });
    });
    test("status: 200 - responds with empty array for article with no comments", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).toEqual([]);
        });
    });
    test("status: 404 - msg 'Article ID not found' for valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/9999/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Article ID not found");
        });
    });
    test("status: 400 - msg 'Invalid article ID' for invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalid_id/comments")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid article ID");
        });
    });
  });
  describe("POST", () => {
    test("status: 200 - adds comment passed in request body to database for specified article_id", () => {
      const reqBody = { username: "butter_bridge", body: "test body" };
      const commentInDb = {
        article_id: 2,
        comment_id: 19,
        votes: 0,
        created_at: expect.any(String),
        author: "butter_bridge",
        body: "test body",
      };

      return request(app)
        .post("/api/articles/2/comments")
        .send(reqBody)
        .expect(200)
        .then(() => {
          return request(app).get("/api/articles/2/comments").expect(200);
        })
        .then(
          ({
            body: {
              comments: [comment],
            },
          }) => {
            expect(comment).toEqual(commentInDb);
          }
        );
    });
    test("status: 200 - responds with a single object showing the posted comment", () => {
      const reqBody = { username: "butter_bridge", body: "test body" };
      const newComment = {
        article_id: 2,
        comment_id: 19,
        votes: 0,
        created_at: expect.any(String),
        author: "butter_bridge",
        body: "test body",
      };

      return request(app)
        .post("/api/articles/2/comments")
        .send(reqBody)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(newComment);
        });
    });
    test("status: 200 - additional data in request body is ignored", () => {
      const reqBody = {
        username: "butter_bridge",
        body: "test body",
        article_id: "superfluous data",
        created_at: "superfluous data",
        votes: 1000000,
      };
      const newComment = {
        article_id: 2,
        comment_id: 19,
        votes: 0,
        created_at: expect.any(String),
        author: "butter_bridge",
        body: "test body",
      };

      return request(app)
        .post("/api/articles/2/comments")
        .send(reqBody)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment).toEqual(newComment);
        });
    });
    test("status: 400 - msg 'Missing data in request body' for request without 'body' and/or 'username' keys in body", () => {
      return request(app)
        .post("/api/articles/2/comments")
        .send({})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Missing data in request body");
        });
    });
    test("status: 404 - msg 'Username not found' for request with username not in database", () => {
      const reqBody = { username: "non-existent user", body: "test body" };

      return request(app)
        .post("/api/articles/2/comments")
        .send(reqBody)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Username not found");
        });
    });
    test("status: 404 - msg 'Article ID not found' for valid but non-existent article_id", () => {
      const reqBody = { username: "butter_bridge", body: "test body" };

      return request(app)
        .post("/api/articles/9999/comments")
        .send(reqBody)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toEqual("Article ID not found");
        });
    });
    test("status: 400 - msg 'Invalid article ID' for invalid article_id", () => {
      const reqBody = { username: "butter_bridge", body: "test body" };

      return request(app)
        .post("/api/articles/invalid_id/comments")
        .send(reqBody)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid article ID");
        });
    });
  });
});
