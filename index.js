const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bok2n.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        console.log('connected');
        const toolsCollection = client.db('electrool_server').collection('tools');

        const userCollection = client.db('electrool_server').collection('users');

        // show all products
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = toolsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        // show specific product
        app.get('/purchase/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await toolsCollection.findOne(query);
            res.send(product);
        });

        // save registered user
        app.put('/user/:email', async (req, res) => {
            const email = req.params.email;
            const user = req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updateDoc = {
                $set: user
            };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            const token = jwt.sign({ email: email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
            res.send({ result, token });
        });

        //delete product
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await toolsCollection.deleteOne(query);
            res.send(result);
        });

        //add new product
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            const result = await toolsCollection.insertOne(newProduct);
            res.send(result);
        });

    } finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('electrool server is running...');
});

app.listen(port, () => {
    console.log(`electrool server is running on port ${port}`);
});