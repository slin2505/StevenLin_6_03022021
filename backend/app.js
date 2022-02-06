const { json } = require("express");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const saucesRoutes = require("./routes/stuff");
const userRoutes = require("./routes/user");

mongoose.connect('mongodb+srv://skagato:steven123@cluster0.gtbg8.mongodb.net/P6?retryWrites=true&w=majority', { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;