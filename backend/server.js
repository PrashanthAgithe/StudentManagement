const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect("mongodb+srv://prashanthagithe:prashanth@cluster0.vus3a9i.mongodb.net/StudentDB")
  .then(() => console.log("Database Connected Successfully!"))
  .catch((err) => console.log("DB Error:", err));


// ---------------------- SCHEMA INSIDE SAME FILE -----------------------
const StudentSchema = new mongoose.Schema({
  name: String,
  rollno: String,
  email: String
});

const Student = mongoose.model("students", StudentSchema);
// ----------------------------------------------------------------------


// ---------------------- CRUD APIs ----------------------

// Create Student
app.post("/createstudent", async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Students
app.get("/getallstudents", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// Get One Student by ID
app.get("/getstudent/:rollno", async (req, res) => {
  try {
    const student = await Student.findOne({ rollno: req.params.rollno });
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json(student);
  } catch {
    res.status(400).json({ message: "Invalid Roll No" });
  }
});

// Update Student
app.put("/updatestudent/:rollno", async (req, res) => {
  const student = await Student.findOneAndUpdate(
    { rollno: req.params.rollno }, // find by rollno
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true }
  );

  if (!student) return res.status(404).json({ message: "Student not found" });

  res.json(student);
});


// Delete Student
app.delete("/deletestudent/:rollno", async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ rollno: req.params.rollno });
    if (!student) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted Successfully" });
  } catch {
    res.status(400).json({ message: "Invalid Roll No" });
  }
});


// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
