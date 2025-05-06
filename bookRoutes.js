// routes/bookRoutes.js

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Shton një libër të ri
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               year:
 *                 type: integer
 *               pages:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Libri u shtua me sukses
 *       400:
 *         description: Titulli dhe autori janë të obligueshëm
 */
app.post('/books', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('books');
        const collection = db.collection('librat');

        const book = req.body;

        if (!book.title || !book.author) {
            return res.status(400).json({ message: "Titulli dhe autori janë të obligueshëm" });
        }

        const result = await collection.insertOne(book);
        res.status(201).json({ message: "Libri u shtua me sukses", bookId: result.insertedId });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Gabim serveri" });
    }
});
