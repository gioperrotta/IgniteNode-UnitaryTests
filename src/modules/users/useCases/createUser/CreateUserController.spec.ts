import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";
let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    await connection.query(`DELETE FROM users`);
  });

  afterAll(async () => {
     await connection.dropDatabase();
     await connection.close();
  });

  it("Should be able create new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "User Test Name",
      email: "email@usertest.com",
      password: "1234"
    });
    expect(response.status).toBe(201);
  });
});
