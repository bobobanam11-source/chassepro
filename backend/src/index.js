require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(",").map((o) => o.trim())
  : ["*"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/it-auth", require("./routes/it-auth"));
app.use("/api/admin-profile", require("./routes/admin-profile"));
app.use("/api/it-profile", require("./routes/it-profile"));
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
