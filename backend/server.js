const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recipeRoute = require('./routes/recipeRoute');
const bookRoute = require('./routes/bookRoute');
const authRoute = require('./routes/auth');
require('dotenv').config(); // Charger le module dotenv

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000', // Remplacez par l'origine de votre frontend
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions)); // Utiliser le middleware CORS avec des options
app.use(express.json());
app.use(recipeRoute);
app.use(bookRoute);
app.use('/api/auth', authRoute); // Utiliser les routes d'authentification

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});