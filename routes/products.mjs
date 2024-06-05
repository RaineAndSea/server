import express from 'express';
import { ObjectId } from 'mongodb';
import db from '../db/conn.mjs';

const router = express.Router();
class Product {
    title;
    price;
    description;
    type;
    category;
    imgUrl;
    crystals;
    stock;
    variants; // Variant[]

    constructor({ title, price, description, type, category, imgUrl, crystals, variants, stock = 0 }) {
        this.title = String(title);
        this.price = Number(price);
        this.type = String(type);
        this.description = String(description);
        this.category = String(category);
        this.imgUrl = String(imgUrl);
        this.crystals = crystals;
        this.stock = stock;
        this.variants = variants;
    }
}

router.post('/', async (req, res) => {
    const collection = await db.collection('product');
    const product = new Product(req.body);

    const result = await collection.insertOne(product);

    res.send({ sucessful: true, result, entry: req.body });
});

router.post('/many', async (req, res) => {
    const collection = await db.collection('product');
    const products = req.body.products.map(p => new Product(p));

    const result = await collection.insertMany(products);
    res.send({ sucessful: true, result });
});

router.get('/', async (req, res) => {
    const collection = await db.collection('product');
    const { crystal } = req.query;

    let query = {};
    if (crystal && crystal !== 'null') {
        query = { crystals: crystal };
    }

    const result = await collection.find(query).toArray();

    res.send(result);
});

router.get('/categories', async (req, res) => {
    try {
        const collection = await db.collection('product');

        const result = {};
        const allProducts = await collection.find().toArray();

        allProducts.map(product => {
            if (!product.type) {
                return;
            }

            if (!result[product.type]) {
                result[product.type] = [];
            }

            if (result[product.type].includes(product.category)) {
                return;
            }

            result[product.type].push(product.category);
        });

        res.status(200).json({ categories: result });
    } catch (error) {
        console.error('Error calculating cart total:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/purge', async (req, res) => {
    const collection = await db.collection('product');
    const result = collection.deleteMany({});

    res.send({ result });
});
router.put('/modifyProperty', async (req, res) => {
    const collection = await db.collection('product');
    const result = await collection.updateMany(
        { [req.body.attribute]: { $in: req.body.toReplace } },
        { $set: { [req.body.attribute]: req.body.newValue } }
    );

    res.send({ ok: 'ok', result });
});

const toTitleCase = str =>
    str.toLowerCase().replace(/(^|\s|-)(?!and|of|the)\w/g, function (match) {
        return match.toUpperCase();
    });

router.get('/category/:productCategory', async (req, res) => {
    const collection = await db.collection('product');
    const { crystal } = req.query;

    try {
        const category = toTitleCase(req.params.productCategory);
        let type;

        if (category.includes('All-')) {
            type = category.replace('All-', '');
        }

        let query;
        if (type) {
            const typeQ = type.replace(/-/g, ' ');
            query = { type: typeQ };
        } else {
            const categoryQ = category.replace(/-/g, ' ');
            query = { category: categoryQ };
        }

        if (crystal && crystal !== 'null') {
            query = { ...query, crystals: crystal };
        }
        const result = await collection.find(query).toArray();
        res.status(200).send(result);
    } catch (err) {
        res.status(400).send({ err });
    }
});

router.get('/:productId', async (req, res) => {
    const collection = await db.collection('product');

    const result = await collection.findOne({ _id: new ObjectId(req.params.productId) });

    if (!result) {
        res.status(404);
        res.send({ successful: false, errorMessage: 'Product ' + req.params.productId + ' cannot be found' });
        return;
    }

    res.send(result);
});

//modify products with attribute x to have value y for attribute z

// Example request body
// {
//   "toFind": "category",
//   "toUpdate": "price",
//   "toFindValue": "Necklace",
//   "toUpdateValue": "3.99"
// }

router.put('/modifyWhere', async (req, res) => {
    const collection = await db.collection('product');
    const result = await collection.updateMany(
        { [req.body.toFind]: req.body.toFindValue },
        { $set: { [req.body.toUpdate]: req.body.toUpdateValue } }
    );

    res.send({ ok: 'ok', result });
});

router.post('/cart-total', async (req, res) => {
    try {
        const collection = await db.collection('product');

        const { cart } = req.body;
        if (!cart || !cart.products) {
            res.status(400).json({ validated: false, errorMessage: 'Invalid cart' });
            return;
        }

        const { products } = cart;
        let total = 0;

        // Iterate over product IDs and quantities
        for (const productId of Object.keys(products)) {
            const quantity = products[productId];
            const product = await collection.findOne({ _id: new ObjectId(productId) });

            // If product exists, add its price multiplied by quantity to total
            if (product) {
                total += Number(product.price) * quantity;
            }
        }

        res.status(200).json({ total });
    } catch (error) {
        console.error('Error calculating cart total:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
