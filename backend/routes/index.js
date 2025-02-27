const express = require('express');
const router = express.Router();

router.use('/books', require('./bookRoute'));
router.use('/recipes', require('./recipeRoute'));

module.exports = router;