// index.js (ose emri që ka skedari juaj kryesor)
const express = require('express');
const { MongoClient } = require('mongodb');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

app.use(express.json());

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'API për menaxhimin e librave',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./index.js'], // Këtu duhet të tregoni skedarin që përmban komentet Swagger
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Komentet Swagger për endpointin e POST
/**
 * @swagger
 * /books:
 *   post:
 *     summary: Shton një libër të ri
 *     description: Përdoruesi mund të shtojë një libër të ri me titull dhe autor
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       201:
 *         description: Libri u shtua me sukses
 *       400:
 *         description: Titulli dhe autori janë të detyrueshëm
 *       500:
 *         description: Gabim në server
 */
app.post('/books', async (req, res) => {
  // Kodi për shtimin e një libri
});

app.listen(port, () => {
    console.log(`Serveri është startuar në portin ${port}`);
});

