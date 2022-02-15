const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

const saucesRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");

require('dotenv').config();
mongoose.connect(process.env.mongo, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
app.use(cors());
app.use(helmet({crossOriginResourcePolicy : false,})); 

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;