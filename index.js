const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

const MongoClient = require('mongodb').MongoClient;

require('dotenv').config()

const app = express()
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3333;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hrpca.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {

    const productsCollection = client.db("hostguru").collection("services");
    const reviewsCollection = client.db("hostguru").collection("reviews");
    const orderCollection = client.db("hostguru").collection("order");
    const adminCollection = client.db("hostguru").collection("admin");

    // Add products API
    app.post('/addservice', (req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // all products API
    app.get('/AllServices', (req, res) => {
        productsCollection.find({}).limit(8)
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    // Product CheckOut to single product
    app.get('/service/:id', (req, res) => {
        productsCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })
    // delete product
    app.delete('/delete/:id', (req, res) => {
        productsCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })

    // Customers Review API
    app.post('/customerReview', (req, res) => {
        const reviews = req.body;
        reviewsCollection.insertOne(reviews)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // all products API
    app.get('/AllReview', (req, res) => {
        reviewsCollection.find({}).limit(8)
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Add Order API
    app.post('/addOrder', (req, res) => {
        const products = req.body;
        orderCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    // all Order API
    app.get('/AllOrder', (req, res) => {
        orderCollection.find({ email: email })
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // Add Admin API
    app.post('/addAdmin', (req, res) => {
        const products = req.body;
        adminCollection.insertOne(products)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    })

    //  AllAdmin API
    app.get('/AllAdmin', (req, res) => {
        adminCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    // delete product
    app.delete('/delete/:id', (req, res) => {
        adminCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })


    //SHowing Order By email API
    app.get('/showOrders/:email', (req, res) => {
        const email = req.params.email;
        console.log(email);
        adminCollection.find({ email: email })
            .toArray((err, admin) => {
                let filter = { email: email }
                if (admin.length === 1) {
                    filter = '';
                }
                console.log(admin.length);
                orderCollection.find(filter)
                    .toArray((err, documents) => {
                        // console.log(documents)
                        res.send(documents);
                    })
            })
    })






});

app.get('/', (req, res) => {
    res.send('Server is Working!')
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})