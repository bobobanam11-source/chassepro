require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/produits", require("./routes/produits"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/marques", require("./routes/marques"));
app.use("/api/carousel", require("./routes/carousel"));
app.use("/api/commandes", require("./routes/commandes"));
app.use("/api/stats", require("./routes/stats"));

// Health check
app.get("/", (req, res) => res.json({ status: "ok", app: "Garminchasse API" }));

app.listen(process.env.PORT || 4000, () =>
  console.log(`🚀 API démarrée sur le port ${process.env.PORT || 4000}`)
);
