var config = require('./dbConfig');
const sql = require('mssql');


async function getToDos(){
    try{
        let ppl = await sql.connect(config);
        let todos = await pool.request().query("select * from ToDos");
        return todos.recordsets;
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    getToDos: getToDos
}