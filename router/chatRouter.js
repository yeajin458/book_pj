const express = require('express');
const router = express.Router();
var chat=require('../lib/chat')

router.get('/', (req, res) => {
    chat.home(req,res)
});
router.get('/room/:id', (req, res) => {
    chat.room(req,res)
});
module.exports = router;
