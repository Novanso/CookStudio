const express = require('express');
const router = express.Router();

router.use('/api/books', require('./bookRoute'));
router.use('/api/recipes', require('./recipeRoute'));

module.exports = router;