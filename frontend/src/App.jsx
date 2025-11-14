import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState([]);

  // Create form
  const [createData, setCreateData] = useState({
    name: "",
    rollno: "",
    email: "",
  });

  // Edit form (rollno is identifier, cannot be changed)
  const [editData, setEditData] = useState({
    rollno: "",
    name: "",
    email: "",
  });

  // Delete form (rollno only)
  const [deleteRoll, setDeleteRoll] = useState("");

  // Fetch all
  const loadStudents = async () => {
    const res = await fetch("http://localhost:5000/getallstudents");
    const data = await res.json();
    setStudents(data);
  };
  console.log(students);
  useEffect(() => {
    loadStudents();
  }, []);

  // Create
  const createStudent = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:5000/createstudent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(createData),
    });
    setCreateData({ name: "", rollno: "", email: "" });
    loadStudents();
  };

  // Edit
  const editStudent = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/updatestudent/${editData.rollno}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditData({ rollno: "", name: "", email: "" });
    loadStudents();
  };

  // Delete
  const deleteStudent = async (e) => {
    e.preventDefault();
    await fetch(`http://localhost:5000/deletestudent/${deleteRoll}`, {
      method: "DELETE",
    });
    setDeleteRoll("");
    loadStudents();
  };

  // Fill edit form when row clicked
  const fillEditForm = (stu) => {
    setEditData({
      rollno: stu.rollno,
      name: stu.name,
      email: stu.email,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container">
      <h1>Student Management</h1>

      {/* CREATE */}
      <div className="card">
        <h2>Add Student</h2>
        <form onSubmit={createStudent}>
          <input
            placeholder="Name"
            value={createData.name}
            onChange={(e) =>
              setCreateData({ ...createData, name: e.target.value })
            }
          />
          <input
            placeholder="Roll No"
            value={createData.rollno}
            onChange={(e) =>
              setCreateData({ ...createData, rollno: e.target.value })
            }
          />
          <input
            placeholder="Email"
            value={createData.email}
            onChange={(e) =>
              setCreateData({ ...createData, email: e.target.value })
            }
          />
          <button type="submit" className="btn create-btn">
            Create
          </button>
        </form>
      </div>

      {/* EDIT */}
<div className="card">
  <h2>Edit Student</h2>
  <form onSubmit={editStudent}>
    <input
      placeholder="Enter Roll No"
      value={editData.rollno}
      onChange={(e) =>
        setEditData({ ...editData, rollno: e.target.value })
      }
    />

    <input
      placeholder="New Name"
      value={editData.name}
      onChange={(e) =>
        setEditData({ ...editData, name: e.target.value })
      }
    />

    <input
      placeholder="New Email"
      value={editData.email}
      onChange={(e) =>
        setEditData({ ...editData, email: e.target.value })
      }
    />

    <button type="submit" className="btn update-btn">
      Update
    </button>
  </form>
</div>


      {/* DELETE */}
      <div className="card">
        <h2>Delete Student</h2>
        <form onSubmit={deleteStudent}>
          <input
            placeholder="Roll No"
            value={deleteRoll}
            onChange={(e) => setDeleteRoll(e.target.value)}
          />
          <button type="submit" className="btn delete-btn">
            Delete
          </button>
        </form>
      </div>

      {/* TABLE */}
<h2>All Students</h2>
<table className="students-table">
  <thead>
    <tr>
      <th>Roll No</th>
      <th>Name</th>
      <th>Email</th>
    </tr>
  </thead>

  <tbody>
    {students.length === 0 ? (
      <tr>
        <td colSpan="3" className="no-data">No students found</td>
      </tr>
    ) : (
      students.map((stu) => (
        <tr key={stu.rollno}>
          <td>{stu.rollno}</td>
          <td>{stu.name}</td>
          <td>{stu.email}</td>
        </tr>
      ))
    )}
  </tbody>
</table>

    </div>
  );
}

export default App;
