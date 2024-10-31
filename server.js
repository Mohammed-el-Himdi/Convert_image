const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "build")));

// Example API endpoint
app.get("/api/example", (req, res) => {
  res.json({ message: "Hello from the server!" });
});

// Catch-all handler for any other requests (for React routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});