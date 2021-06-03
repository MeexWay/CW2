// // Import dependencies modules:
// const expressress = require('expressress')
// // const bodyParser = require('body-parser')


// // Create an expressress.js instance:
// const app = expressress()

// // config expressress.js
// app.use(expressress.json())
// app.set('port', 3000)
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     next();
// })

// // connect to MongoDB
// const MongoClient = require('mongodb').MongoClient;
// let db;
// MongoClient.connect('mongodb+srv://meex:12345@cluster0.orkke.mongodb.net', (err, client) => {
//     db = client.db('coursework2')
// })

// // dispaly a message for root path to show that API is working
// app.get('/', (req, res, next) => {
//     res.send('Select a collection, e.g., /collection/messages')
// })

// // get the collection name
// app.param('collectionName', (req, res, next, collectionName) => {
//     req.collection = db.collection(collectionName)
//     // console.log('collection name:', req.collection)
//     return next()
// })

// // retrieve all the objects from an collection
// app.get('/collection/:collectionName', (req, res, next) => {
//     req.collection.find({}).toArray((e, results) => {
//         if (e) return next(e)
//         res.send(results)
//     })
// })

// //adding post
// app.post('/collection/:collectionName', (req, res, next) => {
//     req.collection.insert(req.body, (e, results) => {
//         if (e) return next(e)
//         res.send(results.ops)
//     })
// })

// // return with object id 

// const ObjectID = require('mongodb').ObjectID;
// app.get('/collection/:collectionName/:id'
//     , (req, res, next) => {
//         req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
//             if (e) return next(e)
//             res.send(result)
//         })
//     })


// //update an object 

// app.put('/collection/:collectionName/:id', (req, res, next) => {
//     req.collection.update(
//         { _id: new ObjectID(req.params.id) },
//         { $set: req.body },
//         { safe: true, multi: false },
//         (e, result) => {
//             if (e) return next(e)
//             res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
//         })
// })





// app.delete('/collection/:collectionName/:id', (req, res, next) => {
//     req.collection.deleteOne(
//         { _id: ObjectID(req.params.id) }, (e, result) => {
//             if (e) return next(e)
//             res.send((result.result.n === 1) ?
//                 { msg: 'success' } : { msg: 'error' })
//         })
// })


// const port = process.env.PORT || 3000
// app.listen(port)

//import modules
const express = require('express')
const { ObjectID } = require('mongodb')

//create an expressress js instance
const app = express()

//config expressress js
app.use(express.json())
//let expressress know where to render static files from
app.use(express.static("public"))

const port = process.env.PORT || 3000

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept');
    res.setHeader('Access-Control-Allow-Methods', 'PUT');

    next()
})

//Connect to mongodb client
const MongoClient = require('mongodb').MongoClient
let db
MongoClient.connect('mongodb+srv://meex:12345@cluster0.orkke.mongodb.net', (err, client) => {
    db = client.db('coursework2')
})
//set parameters for the routes
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next()
})

//render the frontend of the app
app.get('/', (req, res, next) => {
    res.render("index.html");
    next();
})


//retrieve all the objects from the collections in the database
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})
// add objects to each collection in the database
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (err, result) => {
        if (err) return next(err);
        res.send(result.ops);
    })
})
//middleware to update spaces of lesson collection
app.put("/:collectionName/:id", (req, res, next) => {
    req.collection.update({
            _id: new ObjectID(req.params.id)
        }, {
            $set: req.body
        }, {
            safe: true,
            multi: false
        },
        (e, result) => {
            if (e) return next(e);
            res.send((result.result.n === 1 ? {
                msg: "success"
            } : {
                msg: "error"
            }))
        }
    )
})

//retrieve customer orders by name and phone
// app.get('/collection/:collectionName/:name/:phone', (req, res, next) => {
//     req.collection.find({
//         name: (req.params.name),
//         phone: (req.params.phone)
//     }).toArray((e, result) => {
//         if (e) return next(e)
//         res.send(result)
//     })
// })
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})