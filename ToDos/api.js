var db = require('./dboperations');
var ToDo = require('./ToDo');
const dboperations = require('./dboperations');

dboperations.getToDos().then(result => {
    console.log(result);
})
