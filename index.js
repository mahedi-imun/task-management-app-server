const express = require('express')
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lgbeq.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("task-management").collection('task');

        app.post('/task', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result)
        });

        app.get('/task', async (req, res) => {
            const result = await taskCollection.find().toArray();
            res.send(result)
        });
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await taskCollection.findOne(query);
            res.send(result)
        });
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const task = req.body;
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: task,
            };
            const result = await taskCollection.updateOne(filter, updatedDoc);
            res.send(result)
        });
        app.patch('/task/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    compleat: true,
                },
            };
            const result = await taskCollection.updateOne(filter, updatedDoc);
            res.send(result)
        });
        app.get('/task-date/:date', async (req, res) => {
            const date = req.params.date;
            const query = { date }
            const result = await taskCollection.find(query).toArray();
            res.send(result)

        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('task app running !')
})

app.listen(port, () => {
    console.log(`task management app listening on port ${port}`)
})