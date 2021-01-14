const express = require('express');
const router = express.Router();
const todosService = require('./todos.service.js');

// routes
// router.post('/authenticate', authenticate);
router.get('/todos', getAll);

module.exports = router;

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getAll(req, res, next) {
    todosService.getAll()
        .then(todos => res.json(todos))
        .catch(next);
}
