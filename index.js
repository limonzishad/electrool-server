const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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