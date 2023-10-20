const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const cors =require('cors');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.044ysfk.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const productCollections = client.db('allProduct').collection('products');
    const myCartCollections = client.db('allProduct').collection('myCart');

    app.post('/allProducts', async(req, res) => {
      const newProduct =req.body;
      const result = await productCollections.insertOne(newProduct)
      res.send(result);
    })
    app.get('/allProducts', async (req, res) => {
      const cursor = productCollections.find();
      const result = await cursor.toArray();
      res.send(result);
  })
    app.get('/allProducts/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollections.findOne(query);
      res.send(result);
    })


    app.put('/allProducts/:id', async(req, res)=>{
      const id = req.params.id;
      const data = req.body;
      const query = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          name:data.name,
          brand:data.brand,
          price:data.price,
          description:data.description,
          imageUrl:data.imageUrl,
          rating:data.rating
          
        }
      };
      const result = await productCollections.updateOne(query, updateDoc);
      res.send(result);
    })


      // Add Cart \\

    app.post('/myCart', async(req, res) => {
      const newCart = req.body;
      const result = await myCartCollections.insertOne(newCart);
      res.send(result);
    });

    app.get('/myCart', async (req, res) => {
      const cursor = myCartCollections.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.delete('/myCart/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await myCartCollections.deleteOne(query);
      res.send(result);
    }); 



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res)=>{
    res.send("hello world")
});
app.listen(port, ()=>{
    console.log(`server is running on Port: ${port}`)
});
