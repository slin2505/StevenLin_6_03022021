// dependances 
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const helmet = require("helmet");

// routes
const saucesRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");

// dotEnv pour cacher les informations importantes 
require('dotenv').config();

// Connection a MongoDB
mongoose.connect(process.env.mongo, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// On utilise express.json , Cors et Helmet 
app.use(express.json());
app.use(cors());
app.use(helmet({crossOriginResourcePolicy : false,})); 

// Dossier Image
app.use("/images", express.static(path.join(__dirname, "images")));

// routes 
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;