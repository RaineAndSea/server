// ProductRoutes.js

import express from 'express';
import {
    calculateCartTotal,
    createManyProducts,
    createProduct,
    getCategoryProducts,
    getProductById,
    getProductCategories,
    getProducts,
    modifyProductProperty,
    modifyWhere,
    purgeProducts
} from '../controller/ProductController.mjs';
import { protectedWithRole } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/', protectedWithRole('admin'), createProduct);
router.post('/many', protectedWithRole('admin'), createManyProducts);
router.get('/', getProducts);
router.get('/categories', getProductCategories);
router.delete('/purge', protectedWithRole('admin'), purgeProducts);
router.put('/modifyProperty', protectedWithRole('admin'), modifyProductProperty);
router.get('/category/:productCategory', getCategoryProducts);
router.get('/:productId', getProductById);
router.put('/modifyWhere', protectedWithRole('admin'), modifyWhere);
router.post('/cart-total', calculateCartTotal);

export const productRouter = router;
