const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");

afterAll(() => db.end());
beforeEach(() => seed(data));

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
      };
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article).toEqual(article1);
        });
    });
    test("status: 404 - msg 'Item ID not found' for valid but non-existent article_id", () => {
      return request(app)
        .get("/api/articles/999999")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Item ID not found");
        });
    });
    test("status: 400 - msg 'Invalid item ID' for invalid article_id", () => {
      return request(app)
        .get("/api/articles/invalid_id")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid item ID");
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
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).toBe(110);
            });
        });
    });
    test("status: 200 - decrements votes for specified article in database by negative integer passed in request body", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -10 })
        .expect(200)
        .then(() => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.votes).toBe(90);
            });
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
    test("status: 400 - msg 'Invalid inc_votes data in request body' for request with invalid inc_votes data type", () =>{
        return request(app)
        .patch("/api/articles/1")
        .send({inc_votes: 'invalid data'})
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid inc_votes data in request body");
        });
    })
  });
});

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
