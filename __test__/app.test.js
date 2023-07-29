const request = require("supertest");
const app = require("../app");
const db = require("../createDB");

beforeAll(async () => {
  await db.createSchema();
})

afterAll(async () => {
  db.conn().run("DROP TABLE USERS");
});

//Test on 'test' scheme - user table
//This suite tests success results
describe("Test - positive", () => {  
  const user = {
    name: "Bear Bot",
    addr: "Hug area, love society, peace planet"
  }

  test("It should return success message", async () => {
    const response = await request(app).post("/users").send(user);
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toEqual(expect.stringContaining("New record"));
  });

  test("It should return success message", async () => {
    const response = await request(app).get("/users/1");
      expect(response.statusCode).toBe(200);
      expect(response.body.name).toEqual(expect.stringContaining("Bear Bot"));
  });

  const updateUser = {
    name: "Super Bot",
    addr: "Hero area, high society, super planet"
  }

  test("It should return success message", async () => {
    const response = await request(app).post("/users/1").send(updateUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toEqual(expect.stringContaining("Record updated"));
  });

  test("It should return success message", async () => {
    const response = await request(app).delete("/users/1");
      expect(response.statusCode).toBe(200);
      expect(response.body.msg).toEqual(expect.stringContaining("deleted"));
  });
});

//Test on 'test' scheme - user table
//This suite tests failure results
describe("Test - Negative", () => {  
  const user = {
    nme: "Bear Bot", //Invalid column
    addr: "Hug area, love society, peace planet"
  }

  test("It should return failure message", async () => {
    const response = await request(app).post("/users").send(user);
      console.log(response.body);
      expect(response.statusCode).toBe(500);
      expect(response.body.msg).toEqual(expect.stringContaining("Name and address"));
  });

  test("It should return failure message", async () => {
    const response = await request(app).get("/users/1");
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toEqual(expect.stringContaining("Record not found"));
  });

  const updateUser = {
    name: "Super Bot",
    addr: "Hero area, high society, super planet"
  }

  test("It should return failure message", async () => {
    const response = await request(app).post("/users/1").send(updateUser);
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toEqual(expect.stringContaining("No record"));
  });

  test("It should return failure message", async () => {
    const response = await request(app).delete("/users/1");
      expect(response.statusCode).toBe(400);
      expect(response.body.msg).toEqual(expect.stringContaining("No record"));
  });
});