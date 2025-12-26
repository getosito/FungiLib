const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fungiRoutes = require("./routes/fungiRoutes");
const authRoutes = require("./routes/authRoutes");
const { authenticate, attachRole } = require("./middleware/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.use(authenticate);

app.use(attachRole);

app.get("/", (req, res) => {
  res.send("FungiLib API is running 🍄");
});

app.use("/api/auth", authRoutes);
app.use("/api/fungi", fungiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
