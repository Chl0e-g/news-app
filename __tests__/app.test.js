const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data");
const db = require("../db");

afterAll(() => db.end());
beforeEach(() => seed(data));

