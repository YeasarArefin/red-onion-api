const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://myuserdb:jMu1AWcsqfE3zXDJ@cluster0.3xxnz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {

    res.send('hello i am back');

});

async function run() {

    try {

        await client.connect();
        const database = client.db("mealDB");
        const mealsCollections = database.collection("meals");

        app.post('/meals', async (req, res) => {

            const meal = req.body;
            const result = await mealsCollections.insertOne(meal);
            res.json(result);

        });

        app.get('/meals', async (req, res) => {

            const result = await mealsCollections.find({}).toArray();
            res.send(result);

        });

        app.get('/meals/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await mealsCollections.findOne(query);
            res.send([result]);

        });

        app.delete('/meals/:id', async (req, res) => {

            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await mealsCollections.deleteOne(query);
            res.send(result);

        });

    } finally {
        // await client.close();
    }

}
run().catch(console.dir);

app.listen(port, () => {
    console.log('response from port', port);
});