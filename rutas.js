const express = require('express');
const rutas = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pastel:
 *       type: object
 *       properties:
 *         idpasteles:
 *           type: integer
 *           example: 1
 *         nombre:
 *           type: string
 *           example: Pastel de Chocolate
 *         tamaño:
 *           type: string
 *           example: Grande
 *         porciones:
 *           type: integer
 *           example: 12
 *         categoria:
 *           type: string
 *           example: Clásico
 */

/**
 * @swagger
 * tags:
 *   - name: Postres
 *     description: Operaciones CRUD para la tabla de postres
 */

/**
 * @swagger
 * /api:
 *   get:
 *     tags:
 *       - Postres
 *     summary: Obtener todos los postres
 *     responses:
 *       200:
 *         description: Lista de postres
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pastel'
 */
rutas.get('/', (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        connection.query('SELECT * FROM pasteles', (err, results) => {
            if (err) return res.status(500).send(err);

            res.json(results);
        });
    });
});

/**
 * @swagger
 * /api/{id}:
 *   get:
 *     tags:
 *       - Postres
 *     summary: Obtener un pastel por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pastel
 *     responses:
 *       200:
 *         description: Datos del pastel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Pastel'
 *       404:
 *         description: Pastel no encontrado
 */
rutas.get('/:id', (req, res) => {
    const { id } = req.params;
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        connection.query('SELECT * FROM pasteles WHERE idpasteles = ?', [id], (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.length === 0) {
                return res.status(404).send({ message: 'Pastel no encontrado' });
            }

            res.json(result[0]);
        });
    });
});

/**
 * @swagger
 * /api:
 *   post:
 *     tags:
 *       - Postres
 *     summary: Crear un nuevo pastel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pastel'
 *     responses:
 *       201:
 *         description: Pastel creado
 */
rutas.post('/', (req, res) => {
    const nuevoPastel = req.body;
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        connection.query('INSERT INTO pasteles SET ?', [nuevoPastel], (err, result) => {
            if (err) return res.status(500).send(err);

            res.json({ message: 'Pastel agregado', id: result.insertId });
        });
    });
});

/**
 * @swagger
 * /api/{id}:
 *   put:
 *     tags:
 *       - Postres
 *     summary: Actualizar un pastel por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pastel
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pastel'
 *     responses:
 *       200:
 *         description: Pastel actualizado
 */
rutas.put('/:id', (req, res) => {
    const { id } = req.params;
    const datosActualizados = req.body;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        connection.query('UPDATE pasteles SET ? WHERE idpasteles = ?', [datosActualizados, id], (err, result) => {
            if (err) return res.status(500).send(err);

            res.json({ message: 'Pastel actualizado' });
        });
    });
});

/**
 * @swagger
 * /api/{id}:
 *   delete:
 *     tags:
 *       - Postres
 *     summary: Eliminar un pastel por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del pastel
 *     responses:
 *       200:
 *         description: Pastel eliminado
 *       404:
 *         description: Pastel no encontrado
 */
rutas.delete('/:id', (req, res) => {
    const { id } = req.params;

    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        connection.query('DELETE FROM pasteles WHERE idpasteles = ?', [id], (err, result) => {
            if (err) return res.status(500).send(err);

            if (result.affectedRows === 0) {
                return res.status(404).send({ message: 'Pastel no encontrado' });
            }

            res.json({ message: 'Pastel eliminado' });
        });
    });
});

module.exports = rutas;