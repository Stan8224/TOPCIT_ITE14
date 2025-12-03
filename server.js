// SUBJECT TO CHANGE ONCE FINALIZED!!!!
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000; // Render assigns this automatically

app.get("/", (req, res) => {
  res.send("Hello Render!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});