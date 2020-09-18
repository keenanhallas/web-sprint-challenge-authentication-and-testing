const supertest = require("supertest");

const server = require("../api/server");
const db = require("../database/dbConfig");

describe("Tests the server", () => {
    describe("Tests the register endpoint", () => {
        beforeEach(async () => {
            await db("users").truncate();
        });

        it("Should return a status code of 201", () => {
            return supertest(server)
                .post("/api/auth/register")
                .send({ username: "coolestdood", password: "password" })
                .then(res => {
                    expect(res.status).toBe(201);
                });
        })

        it("Should return a JSON object", () => {
            return supertest(server)
                .post("/api/auth/register")
                .send({ username: "coolestdood", password: "password" })
                .then(res => {
                    expect(res.type).toMatch(/json/i);
                });
        })
    })

    describe("Tests the login endpoint", () => {
        it("Should return a status code of 500 with a missing password", () => {
            return supertest(server)
                .post("/api/auth/login")
                .send({ username: "coolestdood" })
                .then(res => {
                    expect(res.status).toBe(500);
                });
        })

        it("Should return a status code of 200 with correct credentials", () => {
            return supertest(server)
                .post("/api/auth/login")
                .send({ username: "coolestdood", password: "password" })
                .then(res => {
                    expect(res.status).toBe(200);
                });
        })
    })

    describe("Tests the GET endpoint", () => {
        it("Should return a status code of 401 when not logged in", () => {
            return supertest(server)
                .get("/api/jokes")
                .then(res => {
                    expect(res.status).toBe(401);
                });
        })

        it("Should return a JSON object with a message when not logged in", () => {
            return supertest(server)
                .get("/api/jokes")
                .then(res => {
                    console.log(res.text);
                    expect(res.type).toMatch(/json/i);
                });
        })
    })
});