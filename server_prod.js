const express = require("express");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const employee = require("./routes/employee");
const auth = require("./routes/auth");
const admin = require("./routes/admin");

app.use("/api/auth/", auth);
app.use("/api/employee/", employee);
app.use("/api/admin/", admin);

// Serve static assets if in production
console.log("production");
// Set static folder

app.use(express.static("client/build"));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
