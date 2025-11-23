const express = require('express');
const data = require('../utils/raw_data');
const {
  addToCart,
  getCartData,
  deleteCartItem,
  updateCartItem,
} = require('../services/services');
const { getToken } = require('../utils/helper');
const { messages } = require('../controller/errorController');
const APIError = require('../controller/errorController');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const data = await getCartData(getToken(req));
    res.status(200).json(data);
  } catch (e) {
    res
      .status(e.status ?? 500)
      .json({ message: e?.message ?? 'something went wrong' });
  }
});

router.post('/', async (req, res) => {
  try {
    const productId = req.query.id;
    const { quantity: qty = 1 } = req.body;
    const data = await addToCart(getToken(req), productId, qty);
    res.status(200).json(data);
  } catch (e) {
    console.log(e);
    res
      .status(e.status ?? 500)
      .json({ message: e?.message ?? 'something went wrong' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const prodcutId = req.params?.id ?? '';
    const { quantity: qty, operation } = req.body;
    if (!prodcutId) throw new APIError('Id is missing', 400);
    const result = await updateCartItem(
      getToken(req),
      prodcutId,
      operation,
      qty
    );
    if (result) res.status(202).json({ message: ' updated qunaity' });
  } catch (e) {
    console.log(e);
    res
      .status(e.status ?? 500)
      .json({ message: e?.message ?? 'something went wrong' });
  }
});

router.delete('/:id', async (req, res) => {
  const productId = req.params?.id;
  if (!productId) {
    res.status(400).json({ message: 'Product id is required' });
    return;
  }
  const result = await deleteCartItem(getToken(req), productId);
  if (result) {
    res
      .send(200)
      .json({ messages: `Item with id ${productId} deleted successfully` });
  } else {
    res.status(400).json({ message: 'Failed the delete operation' });
  }
});

module.exports = router;
