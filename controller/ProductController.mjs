import { ProductService, toTitleCase } from "../service/ProductService.mjs";

export const createProduct = async (req, res) => {
  try {
    const { result, product } = await ProductService.insertProduct(req.body);
    res.send({ successful: true, result, entry: req.body });
  } catch (error) {
    res.status(500).send({ successful: false, errorMessage: error.message });
  }
};

export const createManyProducts = async (req, res) => {
  try {
    const result = await ProductService.insertManyProducts(req.body.products);
    res.send({ successful: true, result });
  } catch (error) {
    res.status(500).send({ successful: false, errorMessage: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { crystal } = req.query;
    let query = {};
    if (crystal && crystal !== 'null') {
      query = { crystals: crystal };
    }
    const result = await ProductService.findProducts(query);
    res.send(result);
  } catch (error) {
    res.status(500).send({ successful: false, errorMessage: error.message });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const categories = await ProductService.getProductCategories();
    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const purgeProducts = async (req, res) => {
  try {
    const result = await ProductService.deleteAllProducts();
    res.send({ result });
  } catch (error) {
    res.status(500).send({ successful: false, errorMessage: error.message });
  }
};

export const modifyProductProperty = async (req, res) => {
  try {
    const { attribute, toReplace, newValue } = req.body;
    const result = await ProductService.updateProducts({ [attribute]: { $in: toReplace } }, { [attribute]: newValue });
    res.send({ ok: 'ok', result });
  } catch (error) {
    res.status(500).send({ successful: false, errorMessage: error.message });
  }
};

export const getCategoryProducts = async (req, res) => {
  try {
    const category = toTitleCase(req.params.productCategory);
    const { crystal } = req.query;
    let type, query;

    if (category.includes('All-')) {
      type = category.replace('All-', '');
    }

    if (type) {
      query = { type: type.replace(/-/g, ' ') };
    } else {
      query = { category: category.replace(/-/g, ' ') };
    }

    if (crystal && crystal !== 'null') {
      query = { ...query, crystals: crystal };
    }

    const result = await ProductService.findProducts(query);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ errorMessage: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const result = await ProductService.findProductById(req.params.productId);

    if (!result) {
      res.status(404).send({ successful: false, errorMessage: `Product ${req.params.productId} cannot be found` });
      return;
    }

    res.send(result);
  } catch (error) {
    res.status(500).send({ successful: false, errorMessage: error.message });
  }
};

export const modifyWhere = async (req, res) => {
  try {
    const { toFind, toFindValue, toUpdate, toUpdateValue } = req.body;
    const result = await ProductService.updateProducts({ [toFind]: toFindValue }, { [toUpdate]: toUpdateValue });
    res.send({ ok: 'ok', result });
  } catch (error) {
    res.status(500).send({ successful: false, errorMessage: error.message });
  }
};

export const calculateCartTotal = async (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || !cart.products) {
      res.status(400).json({ validated: false, errorMessage: 'Invalid cart' });
      return;
    }

    const total = await ProductService.calculateCartTotal(cart);

    res.status(200).json({ total });
  } catch (error) {

    res.status(500).json({ error: 'Internal server error' });
  }
};
