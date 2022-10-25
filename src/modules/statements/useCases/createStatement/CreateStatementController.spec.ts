import request from "supertest";
import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";
let connection: Connection;

describe("Create Statement Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
    await connection.query(`DELETE FROM users`);
    await connection.query(`DELETE FROM statements`);
    
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

  it("Should be able create statetment deposit", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "email@usertest.com",
      password: "1234",
    });

    const { token } = responseToken.body;
   

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Descripition Test Deposit"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
  });

  it("Should be able create statetment withdraw", async () => {
    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: "email@usertest.com",
      password: "1234",
    });

    const { token } = responseToken.body;

    await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "Descripition Test Deposit"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

      const responseWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 120,
        description: "Descripition Test Deposit"
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(responseWithdraw.status).toBe(201);
  });
});
