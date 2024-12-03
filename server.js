const cors = require('cors');
const express = require('express');
const mysql = require('mysql2');
const myconnection = require('express-myconnection');
const rutas = require('./rutas');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const app = express();

// Configuración de CORS
const corsOptions = {
    origin: '*', // Permite solicitudes desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
};

app.use(cors(corsOptions));

// Configuración del puerto
app.set('port', process.env.PORT || 2000);

// Configuración de la base de datos
const dbOptions = {
    host: 'autorack.proxy.rlwy.net',
    port: 55862,
    user: 'root',
    password: 'gNMJvkutYwnjlgGHnGjMhuVFTzkGvabU',
    database: 'postres',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000, // Tiempo para intentar conectar (10s)
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
                url: process.env.RAILWAY_URL || 'http://localhost:2000',
            },
        ],
    },
    apis: ['./rutas.js'], // Ruta al archivo donde se documentan los endpoints
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Middleware de Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Middleware para mantener la conexión activa
setInterval(() => {
    const connection = mysql.createConnection(dbOptions);
    connection.connect((err) => {
        if (err) {
            console.error('Error manteniendo la conexión:', err);
        } else {
            connection.ping(); // Mantener la conexión activa
            console.log('Conexión a la base de datos mantenida activa.');
        }
        connection.end(); // Cierra la conexión después del ping
    });
}, 30000); // Cada 30 segundos

// Rutas
app.use('/api', rutas);

// Server running
app.listen(app.get('port'), () => {
    console.log('Servidor respondiendo en el puerto', app.get('port'));
    console.log('Documentación Swagger: http://localhost:2000/api-docs');
});