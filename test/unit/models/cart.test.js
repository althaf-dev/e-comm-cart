const { expect } = require('@playwright/test');
jest.mock('../../../src/config/db.js', () => ({
  redisClient: {
    hGet: jest.fn(),
    hSet: jest.fn(),
    hDel: jest.fn(),
    hGetAll: jest.fn(),
  },
  connectRedis: jest.fn(),
}));
const { addToDb } = require('../../../src/model/cart');
const { redisClient } = require('../../../src/config/db.js');

describe('test card db operations', () => {
  it('test adding items to cart', async () => {
    await addToDb({ userId: 'user01', productId: 1000 });
    expect(redisClient.hSet).toHaveBeenCalledWith(
      'cart:user01',
      'product:1000',
      '{}'
    );
  });
});
