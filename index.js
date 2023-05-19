const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
//ToysDB
//HWa84n6Qks1C4sW7

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.bhmzequ.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    const AddToysCollection = client.db("ToysProducts").collection("Products");

    //Get the Toys
    app.get("/allToys", async (req, res) => {
      const allToys = AddToysCollection.find();
      const result = await allToys.toArray();
      res.send(result);
    });

    //AddToys in the mongoDB
    app.post("/addToys", async (req, res) => {
      const Toys = req.body;
      const result = await AddToysCollection.insertOne(Toys);
      res.send(result);
    });

    //MyToys find by Email
    app.get("/myToys", async (req, res) => {
      console.log(req.query.email);
      let query = {};
      if (req.query?.email) {
        query = { sellerEmail: req.query.email };
      }
      const result = await AddToysCollection.find(query).toArray();
      res.send(result);
    });

    //Updated part
    app.patch("/myJobs/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updatedMyToys = req.body;
      const myJobs = {
        $set: {
          name: updatedMyToys.name,
          pictureURL: updatedMyToys.pictureURL,
          sellerName: updatedMyToys.sellerName,
          sellerEmail: updatedMyToys.sellerEmail,
          subCategory: updatedMyToys.subCategory,
          quantity: updatedMyToys.quantity,
          price: updatedMyToys.price,
          rating: updatedMyToys.rating,
          description: updatedMyToys.description,
        },
      };

      const result = await AddToysCollection.updateOne(filter, myJobs);
      res.send(result);
    });

    //delete part
    app.delete("/myJobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await AddToysCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
