const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

app.use(cors());
app.use(express.json());

//MONGODB USER AND PASSWORD

// tasinpronoy26
// dQeqVTmyHCwSEOTZ

const uri =
  "mongodb+srv://tasinpronoy26:dQeqVTmyHCwSEOTZ@cluster0.ngjfr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection

    const productDb = client.db("ProductDB");
    const products = productDb.collection("products");

    app.post("/products", async (req, res) => {
      const reqFromUser = req.body;
      const result = await products.insertOne(reqFromUser);
      res.send(result);
    });

    app.get("/products", async(req, res) => {
      const cursor = await products.find();
      const result = await cursor.toArray()
      res.send(result);
    });

    app.get("/products/:id", async(req, res) => {
      const productId = req.params.id
      const query = { _id : new ObjectId(productId)}
      const result = await products.findOne(query)
      res.send(result)
      console.log(result)
    })

    app.put('/products/:id', async (req, res) => {
        const cursor = req.params.id;
        const product = req.body;
        const filter = { _id : new ObjectId(cursor)};
        const optional = { upsert : true }
        const update = {
          $set: {
            productName : product.productName,
            category : product.category,
            price : product.price,
            image : product.image
          }
        }

        const result = await products.updateOne(filter, update, optional)
        res.send(result);
    })


    app.delete('/products/:id', async(req, res) => {
        const cursor = req.params.id;
        const query = { _id : new ObjectId(cursor)};
        const result = await products.deleteOne(query);
        res.send(result)

    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`SERVER IS RUNNING ${port}`);
});
