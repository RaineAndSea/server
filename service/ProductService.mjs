// ProductService.js

import { ObjectId } from "mongodb";
import db from "../db/conn.mjs";
import { Product } from "../model/Product.mjs";

export const collection = async () => await db.collection('product');

export const insertProduct = async (productData) => {
  const product = new Product(productData);
  const result = await (await collection()).insertOne(product);
  return { result, product };
};

export const insertManyProducts = async (productsData) => {
  const products = productsData.map(p => new Product(p));
  const result = await (await collection()).insertMany(products);
  return result;
};

export const findProducts = async (query) => {
  return await (await collection()).find(query).toArray();
};

export const findProductById = async (id) => {
  return await (await collection()).findOne({ _id: new ObjectId(id) });
};

export const deleteAllProducts = async () => {
  return await (await collection()).deleteMany({});
};

export const updateProducts = async (filter, update) => {
  return await (await collection()).updateMany(filter, { $set: update });
};

export const toTitleCase = (str) => 
  str.toLowerCase().replace(/(^|\s|-)(?!and|of|the)\w/g, function(match) {
    return match.toUpperCase();
});

export const getProductCategories = async () => {
  const result = {};
  const allProducts = await findProducts({});

  allProducts.forEach(product => {
    if (!product.type) return;

    if (!result[product.type]) {
      result[product.type] = [];
    }

    if (!result[product.type].includes(product.category)) {
      result[product.type].push(product.category);
    }
  });

  return result;
};

export const calculateCartTotal = async (cart) => {
  const { products } = cart;
  let total = 0;

  for (const productId of Object.keys(products)) {
    const quantity = products[productId];
    const product = await findProductById(productId);

    if (product) {
      total += Number(product.price) * quantity;
    }
  }

  return total;
};

export const ProductService = {
  insertProduct,
  insertManyProducts,
  findProducts,
  findProductById,
  deleteAllProducts,
  updateProducts,
  toTitleCase,
  getProductCategories,
  calculateCartTotal
}