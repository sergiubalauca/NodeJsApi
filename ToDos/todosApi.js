// 'use strict';
var express = require('express');
var router = express.Router();

var sql = require('mssql');
var dbConfig = require('./dbConfig');

/* Get All ToDos */
router.get('/todos', function (req, res) {
    sql.connect(dbConfig.dbConnection()).then(() => {
        return sql.query("SELECT * FROM ToDos;");
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
    })
});

/* Add ToDos */
router.post('/addToDo', function (req, res) {
    sql.connect(dbConfig.dbConnection()).then(() => {
        return sql.query("INSERT INTO ToDos VALUES('" + req.body.Title + "', " + req.body.Description + ")");
    }).then(result => {
        res.status(200).send("ToDo Added Successfully.");
    }).catch(err => {
        res.status(415).send("Something Went Wrong !!!");
    })
});

/* Delete ToDos */
router.get('/deleteToDo/:ID', function (req, res) {
    sql.connect(dbConfig.dbConnection()).then(() => {
        return sql.query("DELETE FROM ToDos WHERE ID = " + req.params.ID);
    }).then(result => {
        res.status(200).send("ToDo Deleted Successfully.");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
    })
});

/* Edit ToDos */
router.get('/editToDo/:ID', function (req, res) {
    sql.connect(dbConfig.dbConnection()).then(() => {
        return sql.query("SELECT * FROM ToDos WHERE ID = " + req.params.ID);
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
    })
});

/* Update ToDos */
router.post('/updateToDo', function (req, res) {
    sql.connect(dbConfig.dbConnection()).then(() => {
        return sql.query("UPDATE ToDos SET [Title] = '" + req.body.Title + "', Description = " + req.body.Description + " WHERE ID = " + req.body.ID);
    }).then(result => {
        res.status(200).send("ToDo Updated Successfully.");
    }).catch(err => {
        res.status(500).send("Something Went Wrong !!!");
    })
});

module.exports = router;