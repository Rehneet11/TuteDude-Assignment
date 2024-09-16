const express = require('express');
const userRouter = require('./user');

const friendRouter = require('./friend');

const router = express.Router();

router.use('/user', userRouter);

router.use('/friend', friendRouter); 

module.exports = router;
