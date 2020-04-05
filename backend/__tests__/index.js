import userTest from './integration/controllers/user.test';
import cacheTest from './integration/cache.test';

describe('Tests', () => {
  userTest();
  cacheTest();
});
