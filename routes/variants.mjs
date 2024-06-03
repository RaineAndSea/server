import express from "express";
import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";

class Variant {
    name;
    options;
    isGenericForCategory;

    constructor({name, options, isGenericForCategory}) {
        this.name = name;
        this.options = options;
        this.isGenericForCategory = isGenericForCategory
    }
}

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const collection = await db.collection('variant');
        
        const result = await collection.find().toArray();

        res.status(200).send(result)
    } catch(err) {
        res.status(400).send({err})
    }
});

router.get('/byCategory', async (req, res) => {
    const { category } = req.query;

    try {
        const collection = await db.collection('variant');

        const result = await collection.find({isGenericForCategory: category}).toArray();

        res.status(200).send(result)
    } catch(err) {
        res.status(400).send({err})
    }
})

router.get('/:variantId', async (req, res) => {
    const { variantId } = req.params;
    try {
        const collection = await db.collection('variant');
        const variant = await collection.findOne({ _id: new ObjectId(variantId) });

        if (!variant) {
            return res.status(404).send({ error: 'Variant not found' });
        }

        res.status(200).send(variant);
    } catch (err) {
        res.status(400).send({ error: 'An error occurred', details: err });
    }
});

router.post('/', async (req, res) => {
    try {
        const collection = await db.collection('variant');

        const variant = new Variant(req.body)
        const result = await collection.insertOne(variant);

        res.status(200).send(result)
    } catch(err) {
        res.status(400).send({err})
    }
});

router.delete('/:variantId', async (req, res) => {
    const { variantId } = req.params;
    try {
        const collection = await db.collection('variant');
        const result = await collection.deleteOne({_id: new ObjectId(variantId)});
        res.status(200).send(result);
    } catch(err) {
        res.status(400).send({err})
    }
})

export default router;