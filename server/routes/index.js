const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/books', require('./bookRoute'));
router.use('/recipes', require('./recipeRoute'));
router.use('/meals', require('./meals'));
router.use('/ingredients', require('./ingredientRoute'));
router.use('/users',require('./userRoute'));

module.exports = router;