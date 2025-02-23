const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const recipesRouter = require('./routes/recipes');
const booksRouter = require('./routes/books');
const mealsRouter = require('./routes/meals');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/recipes', recipesRouter);
app.use('/api/books', booksRouter);
app.use('/api/meals', mealsRouter);

mongoose.connect('mongodb://localhost:27017/recipes', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});