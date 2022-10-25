import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";
let connection: Connection;

describe("Get Balance Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    await connection.query(`DELETE FROM users`);

    await request(app).post("/api/v1/users").send({
      name: "User Test Name",
      email: "email@usertest.com",
      password: "1234",
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able get balance to user", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "email@usertest.com",
      password: "1234",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Descripition Test Deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 120,
        description: "Descripition Test Deposit",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    const response = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body.balance).toEqual(80);
  });
});
