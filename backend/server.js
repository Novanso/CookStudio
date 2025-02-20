const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const recettesRouter = require('./routes/recettes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api/recettes', recettesRouter);

mongoose.connect('mongodb://localhost:27017/recettes', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connecté'))
    .catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});