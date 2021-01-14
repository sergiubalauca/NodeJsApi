var config = {
    user: "", // SQL Server Login
    password: "", // SQL Server Password
    server: "localhost", // SQL Server Server name
    database: "Workshop2", // SQL Server Database name
    options: {
        trustedConnection: true,
        enableArithAort: true,
        instancename: 'SQLEXPRESS'
    },
    port: 1234
};

module.exports = config;

