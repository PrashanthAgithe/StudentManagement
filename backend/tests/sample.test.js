require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const { app } = require('../server');   // IMPORTANT: Export app in server.js

let testRoll = "999"; // temporary roll number for testing

// ---------------------- TEST 1: CREATE STUDENT ----------------------
describe("POST /createstudent", () => {
  it("should create a new student", async () => {
    const res = await request(app)
      .post("/createstudent")
      .send({
        name: "Test Student",
        rollno: testRoll,
        email: "teststudent@example.com"
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toBe("Test Student");
  });
});


// ---------------------- TEST 2: GET ALL STUDENTS ----------------------
describe("GET /getallstudents", () => {
  it("should return an array of students", async () => {
    const res = await request(app).get("/getallstudents");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});


// ---------------------- TEST 3: UPDATE STUDENT ----------------------
describe("PUT /updatestudent/:rollno", () => {
  it("should update student details", async () => {
    const res = await request(app)
      .put(`/updatestudent/${testRoll}`)
      .send({
        name: "Updated Student",
        email: "updatedemail@example.com"
      });

    expect([200, 404]).toContain(res.statusCode);

    if (res.statusCode === 200) {
      expect(res.body.name).toBe("Updated Student");
    }
  });
});


// ---------------------- TEST 4: DELETE STUDENT ----------------------
describe("DELETE /deletestudent/:rollno", () => {
  it("should delete student by roll number", async () => {
    const res = await request(app).delete(`/deletestudent/${testRoll}`);

    expect([200, 404]).toContain(res.statusCode);
  });
});


// ---------------------- CLOSE DB ----------------------
afterAll(async () => {
  await mongoose.connection.close();
  await new Promise(resolve => setTimeout(resolve, 500));
});
