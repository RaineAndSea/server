import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";


const router = express.Router();
class Product {
  title;
  price;
  description;
  category;
  imgUrl;

  constructor({title, price, description, category, imgUrl}) {
    this.title = String(title);
    this.price = Number(price);
    this.description = String(description);
    this.category = String(category);
    this.imgUrl = String(imgUrl);
  }
}

router.post('/', async (req, res) => {
  const collection = await db.collection('product');
  const product = new Product(req.body);


  const result = await collection.insertOne(product);

  console.log({
    result, product
  })
  res.send({sucessful: true, result, entry: req.body});
})

router.get('/', async (req, res) => {
  const collection = await db.collection('product');

  const result = await collection.find().toArray();

  res.send(result);
})

router.get('/:productId', async (req, res) => {
  const collection = await db.collection('product');

  console.log({
    req: req.params
  })

  const result = await collection.findOne({_id: new ObjectId(req.params.productId)});

  if(!result) {
    res.status(404);
    res.send({successful: false, errorMessage: 'Product ' + req.params.productId + ' cannot be found'});
    return;
  }

  res.send(result)
})

export default router;