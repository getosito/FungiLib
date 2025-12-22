const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fungiRoutes = require("./routes/fungiRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FungiLib API is running 🍄");
});

app.use("/api/fungi", fungiRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
