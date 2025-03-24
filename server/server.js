const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const recipeRoute = require('./routes/recipeRoute');
const bookRoute = require('./routes/bookRoute');
const authRoute = require('./routes/auth');
const mealsRoute = require('./routes/meals');
const ingredientRoute = require('./routes/ingredientRoute');
const userRoute = require('./routes/userRoute');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(recipeRoute);
app.use(bookRoute);
app.use(mealsRoute)
app.use(userRoute)
app.use(ingredientRoute)
app.use('/api/auth', authRoute);

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});