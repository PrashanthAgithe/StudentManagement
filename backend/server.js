const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// -------------------------
//  PROMETHEUS METRICS
// -------------------------
const clientpm = require("prom-client");
const register = new clientpm.Registry();

// Collect default CPU, memory, event loop metrics
clientpm.collectDefaultMetrics({ register });

// Custom request counter metric
const httpRequestCounter = new clientpm.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests received",
});
register.registerMetric(httpRequestCounter);
// Count all requests
app.use((req, res, next) => {
  httpRequestCounter.inc();
  next();
});
// -------------------------

// -------------------------
//  METRICS ENDPOINT
// -------------------------
app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", register.contentType);
  res.send(await register.metrics());
});

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

// Get One Student by rollno
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

// PARTIAL UPDATE (PATCH)
app.patch("/patchstudent/:rollno", async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { rollno: req.params.rollno },
      req.body, // only update fields that are sent
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(400).json({ message: "Invalid Roll No" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is Running!");
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


const PORT = 5051;
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = { app };
