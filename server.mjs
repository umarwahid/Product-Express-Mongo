import express from "express";
import { customAlphabet } from 'nanoid'
import cors from "cors";
const nanoid = customAlphabet('1234567890', 20);
import { MongoClient, ObjectId } from "mongodb"

import './config/index.mjs'

const mongodbURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.bn8froi.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(mongodbURI, { useNewUrlParser: true, useUnifiedTopology: true });

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
      const query = {}
      const findproducts = await productsCollection.find(query).toArray();
      res.send({
        message: "all products",
        data: findproducts,
      });
    });

    app.get("/product/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) }
      const findproduct = await productsCollection.findOne(query);

      if (!findproduct) {
        res.status(404).send({
          message: "product not found"
        });
      } else {
        res.send({
          message: "product found",
          data: findproduct
        });
      }
    });

    app.post("/product", async (req, res) => {
      const { name, price, quantity, description } = req.body;
      
      if (!name || !price || !description) {
        res.status(403).send(`Required parameter missing.`);
        return;
      }

      const product = {
        name,
        price,
        quantity,
        description,
      };
      
      await productsCollection.insertOne(product);
      res.status(201).send({ message: "Product Created" });
    });

    app.put("/product/:id", async (req, res) => {
      const { name, price, quantity, description } = req.body;
      const query = { _id: new ObjectId(req.params.id) };
      const updateFields = {};

      if (name) updateFields.name = name;
      if (price) updateFields.price = price;
      if (quantity) updateFields.quantity = quantity;
      if (description) updateFields.description = description;

      const updateProduct = await productsCollection.updateOne(query, { $set: updateFields });

      if (updateProduct.modifiedCount === 0) { // Corrected the property to 'modifiedCount'
        res.status(404).send({
          message: "product not found"
        });
      } else {
        res.send({
          message: "Product is Updated.",
          data: updateFields // Corrected to use 'updateFields' instead of 'updateproduct'
        });
      }
    });
    

    app.delete("/product/:id", async (req, res) => {
      try {
        const query = { _id: new ObjectId(req.params.id) };
        const deleteProduct = await productsCollection.deleteOne(query);
    
        if (deleteProduct.deletedCount === 0) {
          res.status(404).send({
            message: "Product not found"
          });
        } else {
          res.send({
            message: "Product is deleted"
          });
        }
      } catch (err) {
        console.error("Error deleting product:", err);
        res.status(500).send("Error deleting product.");
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
