const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys'); // Pide el módulo donde se encuentra los parámetros de la base de datos

const pool = mysql.createPool(database); // Genera la conexión a la base de datos

pool.getConnection((err, connection) => { // Para mantener la conexión
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('DATABASE CONNECTION WAS CLOSED');
        }
        if (err.code === 'ER_CON_COUNT_ERROR'){
            console.error('DATABASE HAS TO MANY CONNECTIONS');
        }
        if (err.code === 'ECONNREFUSED'){
            console.error('DATABASE CONNECTION WAS REFUSED');
        }
    }
    if (connection) connection.release();
    console.log('DB is Connected');
    return;
});

// Promisify Pool Querys, para poder usar promesas en vez de solo callbacks
pool.query = promisify(pool.query);

module.exports = pool;