import { Express } from "express";
import request from "supertest";

import { initializeApplication } from "root/application";

describe("Base Router", () => {
    let application: Express;

    beforeAll(() =>
        initializeApplication().then((app) => {
            application = app;
        })
    );

    describe("/ endpoint", () => {
        describe("GET", () => {
            test("returns a 200 status code", () => request(application).get("/").expect(200));
        }); // close describe("GET")

        describe("POST", () => {
            test("returns a 405 error", () => request(application).post("/").expect(405));
        }); // close describe("POST")

        describe("PATCH", () => {
            test("returns a 405 error", () => request(application).patch("/").expect(405));
        }); // close describe("PATCH")

        describe("PUT", () => {
            test("returns a 405 error", () => request(application).put("/").expect(405));
        }); // close describe("PUT")

        describe("DELETE", () => {
            test("returns a 405 error", () => request(application).delete("/").expect(405));
        }); // close describe("DELETE")
    }); // close describe("/ endpoint")
}); // close describe("Base Router")
