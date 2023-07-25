import express from "express";
import { customAlphabet } from 'nanoid'
import cors from "cors";
const nanoid = customAlphabet('1234567890', 20);
import { MongoClient } from "mongodb"


import './config/index.mjs'

const mongodbURI = `mongodb+srv://dbusername:dbpassword@cluster0.bn8froi.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });
const database = client.db('product');
const productsCollection = database.collection('products');


const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db('product');
    const productsCollection = database.collection('products');

    

    app.get("/", (req, res) => {
      res.send("hello world!");
    });

app.get("/products", async (req, res) => {
  const client = new MongoClient(mongodbURI);
  const database = client.db('product');
  const productsCollection = database.collection('products');

  const query = {}
  const findproducts = await productsCollection.findOne(query);
  await client.close();

  res.send({
    message: "all products",
    data: findproducts,
  });
});

//  https://baseurl.com/product/1231
app.get("/product/:id", async (req, res) => {
  const client = new MongoClient(mongodbURI);
  const database = client.db('product');
  const productsCollection = database.collection('products');

  const query = {_id : req.params.id}
  const findproduct = await productsCollection.findOne(query);
  await client.close();

  // console.log(typeof req.params.id)

  // if (isNaN(req.params.id)) {
  //   res.status(403).send("invalid product id")
  // }

  // let isFound = false;

  // for (let i = 0; i < findproduct.length; i++) {
  //   if (findproduct[i].id === req.params.id) {
  //     isFound = i;
  //     break;
  //   }
  // }
console.log(findproduct)
  if (!findproduct) {
    res.status(404);
    res.send({
      message: "product not found"
    });
  } else {
    res.send({
      message: "product found ",
      data: findproduct
    });
  }
});


app.post("/product", async (req, res) => {

  const client = new MongoClient(mongodbURI);
  const database = client.db('product');
  const productsCollection = database.collection('products');

  const { name, price, description } = req.body;
  
    if (!name || !price || !description) {
      res.status(403).send(`Required parameter missing.`);
      return;
    }
  
    try {
      const productsCollection = getDatabase().collection("products");
      const product = {
        name,
        price,
        description,
      };
      await productsCollection.insertOne(product);
      res.status(201).send({ message: "Product Created" });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).send("Error adding product.");
    }
  });
  

//   const { name, price, description } = req.body;
//   const query = {name, price, description} 
//   const addproduct = await productsCollection.insertOne(query);
//   await client.close();


//   if (!req.body.name || !req.body.price || !req.body.description) {

//     res.status(403).send(`required parameter missing.`);
//       return;
//   }

//   addproduct.push({
//     id: nanoid(),
//     name: req.body.name,
//     price: req.body.price,
//     description: req.body.description,
//   });


//   res.status(201).send({ message: "Product Created" });
// });


app.put("/product/:id", async (req, res) => {
  const client = new MongoClient(mongodbURI);
  const database = client.db('product');
  const productsCollection = database.collection('products');

  const { name, price, description } = req.body;
  const query = {_id : req.params.id}
  const updateproduct = await productsCollection.updateOne(query);
  await client.close();


  if (!name && !price && !description) {

    res.status(403).send(` required parameter missing. 
      atleast one parameter is required: name, price or description to complete update`);
  }


  // let isFound = false;

  // for (let i = 0; i < products.length; i++) {
  //   if (products[i].id === req.params.id) {
  //     isFound = i;
  //     break;
  //   }
  // }

  if (!updateproduct) {
    res.status(404);
    res.send({
      message: "product not found"
    });
  } else {

    if (req.body.name) productsCollection[updateproduct].name = req.body.name
    if (req.body.price) productsCollection[updateproduct].price = req.body.price
    if (req.body.description) productsCollection[updateproduct].description = req.body.description

    res.send({
      message: "Product is Updated. ",
      data: updateproduct[updateproduct]
    });
    
  }
});

app.delete("/product/:id", async (req, res) => {
  const client = new MongoClient(mongodbURI);
  const database = client.db('product');
  const productsCollection = database.collection('products');

  const query = {_id : req.params.id}
  const deleteproduct = await productsCollection.deleteOne(query);
  await client.close();

  // let isFound = false;

  // for (let i = 0; i < products.length; i++) {
  //   if (products[i].id === req.params.id) {
  //     isFound = i;
  //     break;
  //   }
  // }

  if (!deleteproduct) {
    res.status(404);
    res.send({
      message: "product not found"
    });
    
  } else {
    deleteproduct.splice(deleteproduct, 1)

    res.send({
      message: "product is deleted"
    });
  }
});



  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
} catch (err) {
  console.error("Error connecting to MongoDB:", err);
}
}

startServer();
