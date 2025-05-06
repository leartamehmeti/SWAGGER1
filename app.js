const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb://127.0.0.1:27017';//qe na e han shpirtin hahahaha
const client = new MongoClient(url);

app.use(express.json());

// 1. Add a Book
app.post('/books', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('books');
        const collection = db.collection('librat');

        const book = req.body;

        if (!book.title || !book.author) {
            return res.status(400).json({ message: "Titulli edhe autori jon te obligueshem" });
        }

        const result = await collection.insertOne(book);
        res.status(201).json({ message: "Libri u shtua me sukses", bookId: result.insertedId });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Gabim serveri" });
    }
});

// 2. List All Books
app.get('/books', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('books');
        const collection = db.collection('librat');

        const books = await collection.find().toArray();
        res.status(200).json(books);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Gabim serveri" });
    }
});

// 3. Search by Author or Title (also filter by year)
app.get('/books', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('books');
        const collection = db.collection('librat');

        const query = {};

        if (req.query.author) {
            query.author = req.query.author;
        }

        if (req.query.title) {
            query.title = req.query.title;
        }

        if (req.query.before) {
            query.year = { $lt: parseInt(req.query.before) };
        }

        if (req.query.after) {
            query.year = { $gt: parseInt(req.query.after) };
        }

        const books = await collection.find(query).toArray();
        res.status(200).json(books);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Gabim serveri" });
    }
});

// 4. Delete a Book by title
app.delete('/books/:title', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('books');
        const collection = db.collection('librat');

        const bookTitle = req.params.title;

        const result = await collection.deleteOne({ title: bookTitle });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: `Libri me titull "${bookTitle}" u fshi me sukses - gone but not forgotten ose nashta po)` });
        } else {
            res.status(404).json({ message: `Libri me titull "${bookTitle}" nuk u gjet u hup` });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Ndodhi 1 gabim gjate fshirjes' });
    }
});

// 5. Update Book Info (pages or language)
app.patch('/books/:title', async (req, res) => {
    try {
        await client.connect();
        const db = client.db('books');
        const collection = db.collection('librat');

        const bookTitle = req.params.title;
        const updates = req.body;

        const result = await collection.updateOne(
            { title: bookTitle },
            { $set: updates }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: `Libri me titull "${bookTitle}" nuk u gjet` });
        }

        res.status(200).json({ message: `Libri u perditesua me sukses` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Gabim serveri" });
    }
});

    //metoda get me filtrimin e marjeve te librave  te vitit 1958
    app.get('/books', async (req,res) => {
      try{
        await client.connect();
        const db = client.db('books');
        const collection = db.collection('librat');

        //e marim vitin nga query shembull /books?year=1958
        const year = req.query.year;

        // e krijojme nje list te thate dhe mandej i vendosim te dhenat
        let filter = {};

        //kushti nese perdoruesi e ka dhon vitin me shtu ne filter
        if(year){
            filter.year = parseInt(year);
        }

        const books = await collection.find(filter).toArray();

        res.json(books);
      }catch(err){
       console.log("Gabim diqka:",err)
      }
    })

 
    const swaggerUi = require('swagger-ui-express');
    const swaggerJsdoc = require('swagger-jsdoc');
    
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
        apis: ['./index.js'], // Nëse skedari yt ka emër tjetër, vendose atë këtu
    };
    
    const swaggerSpec = swaggerJsdoc(swaggerOptions);
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    



app.listen(port, () => {
    console.log(`Serveri eshte startu ne portin ${port}`);
});
