// backend/server.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5001;

// Dummy database for contacts
let contacts = [
  { id: 1, name: "John Doe", email: "john@example.com", mobile: "1234567890", access: true },
  { id: 2, name: "Jane Smith", email: "jane@example.com", mobile: "9876543210", access: true},
  { id: 3, name: "Maya Jack", email: "maya@example.com", mobile: "98765423210", access: false }
];

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes for CRUD operations
app.get("/api/contacts", (req, res) => {
  res.json(contacts);
});

app.post("/api/contacts", (req, res) => {
  const { name, email, mobile } = req.body;
  const newContact = {
    id: Date.now(),
    name,
    email,
    mobile
  };
  contacts.push(newContact);
  res.status(201).json(newContact);
});

app.put("/api/contacts/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, mobile } = req.body;
  const contact = contacts.find(c => c.id === parseInt(id));

  if (contact) {
    contact.name = name;
    contact.email = email;
    contact.mobile = mobile;
    res.json(contact);
  } else {
    res.status(404).send("Contact not found");
  }
});

app.delete("/api/contacts/:id", (req, res) => {
  const { id } = req.params;
  contacts = contacts.filter(contact => contact.id !== parseInt(id));
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
