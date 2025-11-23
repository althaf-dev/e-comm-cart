const { expect } = require('@playwright/test');
const redisClient = require('../../mock/redisMock');
const { addToCart } = require('../../../src/services/services');
const { addToDb, getItemQty } = require('../../../src/model/cart');
const { getUserInfoFromToken } = require('../../../src/utils/helper');
const axios = require('axios');
const APIError = require('../../../src/controller/errorController');

jest.mock('axios', () => ({
  get: jest.fn().mockResolvedValue({
    data: { _id: 'test-id', name: 'Mock Product' },
  }),
}));

jest.mock('../../../src/utils/helper.js', () => {
  const actual = jest.requireActual('../../../src/utils/helper.js');

  return {
    ...actual,
    getUserInfoFromToken: jest.fn((token) => {
      return {
        userId: 'user01',
      };
    }),
  };
});

jest.mock('../../../src/model/cart', () => {
  const actual = jest.requireActual('../../../src/model/cart');
  return {
    ...actual,
    getItemQty: jest.fn(() => {
      console.log('item qrt');
      return 0;
    }),
    addToDb: jest.fn().mockResolvedValue(true),
  };
});

const generateId = () => {
  const array = new Array(24);
  return array.map((el, i) => i + 1).slice(24);
};

describe('addtoCart operation', () => {
  it('test adding items to the cart', async () => {
    redisClient.hGet.mockResolvedValue(null);
    await addToCart('token', generateId());
    expect(addToDb).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user01',
        productId: 'test-id',
        name: 'Mock Product',
      })
    );
  });

  it('test the case if the item already exist then add the quantity', async () => {
    getItemQty.mockResolvedValue(10);
    axios.get.mockResolvedValue({
      data: { _id: 'prod1', name: 'Mock Product' },
    });

    redisClient.hGet.mockResolvedValue({
      userId: 'user01',
      productId: 'prod1',
      qty: 10,
    });
    await addToCart('token', generateId());
    expect(addToDb).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user01',
        productId: 'prod1',
        qty: 11,
      })
    );
  });

  it('test the case whne the token in invalid or not exist', async () => {
    getUserInfoFromToken.mockReturnValue(null);
    const call = addToCart('token', generateId());
    await expect(call).rejects.toThrow(APIError.messages.NOT_AUTHORIZED);
    await expect(call).rejects.toBeInstanceOf(APIError);
    await expect(call).rejects.toMatchObject({
      status: 401,
    });
  });
});
