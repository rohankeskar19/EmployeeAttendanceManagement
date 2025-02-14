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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
