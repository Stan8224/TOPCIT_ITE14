// SUBJECT TO CHANGE ONCE FINALIZED!!!!
const express = require("express");
const app = express();

// Render provides the PORT environment variable
const PORT = process.env.PORT || 3000;

// Simple route to test the server
app.get("/", (req, res) => {
  res.send("Hello Render!");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});