import express, { Router } from "express";
import request from "supertest";
import { applyMiddleware, applyRoutes } from "../../utils";

import middleware from "../../middleware";
import errorHandlers from "../../middleware/errorHandlers";
import routes from "./email.routes";


//Integration Testing

describe("email routes", () => {
  let router: Router;

  beforeEach(() => {
    router = express();
    applyMiddleware(middleware, router);
    applyRoutes(routes, router);
    applyMiddleware(errorHandlers, router);
  });

  test("get email", async () => {
    const response = await request(router).get("/api/v1/email/123");
    expect(response.status).toEqual(200);
  });

  test("a non-existing api method", async () => {
    const response = await request(router).get("/api/v1/email");
    expect(response.status).toEqual(404);
  });
});