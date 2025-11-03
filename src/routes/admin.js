const express = require('express');
const {
  addProducts,
  getProducts,
  getProductByName,
  removeProduct,
  updateProduct,
} = require('../model/products');

const router = express.Router();

router.get('/', async (req, res) => {
  if (req.query.product) {
    const name = req.query.product;
    const product = await getProductByName(name);
    res.status(200).json(product);
  } else {
    const data = await getProducts();
    res.status(200).json(data);
  }
});

router.post('/add', (req, res) => {
  console.log('data to add', req.body);
  addProducts(req.body);
  res.status(200).json({ message: 'Product added successfully' });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  removeProduct(id);
  res.status(200).json({ message: `Product ${id} deleted successfully` });
});


router.put('/:id', (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  updateProduct(id, updatedData);
  res.status(200).json({ message: `Product ${id} updated successfully` });
});

module.exports = router;
