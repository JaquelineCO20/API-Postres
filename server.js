const express = require('express');
const mysql = require('mysql2');
const myconnection = require('express-myconnection');
const rutas = require('./rutas');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

// Configuración del puerto
app.set('port', process.env.PORT || 2000);

// Configuración de la base de datos
const dbOptions = {
    host: 'autorack.proxy.rlwy.net',
    port: 45599,
    user: 'root',
    password: 'XkMjwWRdiBXxEalgraonEaIDThMpNbvq',
    database: 'postres'
};

// Middleware para la conexión con la base de datos
app.use(myconnection(mysql, dbOptions, 'single'));

// Middleware para parsear JSON
app.use(express.json());

// Opciones para Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Postres',
            version: '1.0.0',
            description: 'API para gestionar postres con operaciones CRUD',
        },
        servers: [
            {
                url: 'http://localhost:2000',
            },
        ],
    },
    apis: ['./rutas.js'], // Ruta al archivo donde se documentan los endpoints
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware de Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Rutas
app.use('/api', rutas);

// Server running
app.listen(app.get('port'), () => {
    console.log('Servidor respondiendo en el puerto', app.get('port'));
    console.log('Documentación Swagger: http://localhost:2000/api-docs');
});