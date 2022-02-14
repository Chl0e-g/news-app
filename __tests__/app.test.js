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
        .then(({ body: topics }) => {
          expect(Array.isArray(topics)).toBe(true);
          expect(topics).toHaveLength(3);
        });
    });
    test("status: 200 - topic objects in response have 'slug' and 'description' properties with string values", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: topics }) => {
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
