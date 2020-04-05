import request from 'supertest';

import factory from '../factories';
import truncate from '../util/truncate';

import app from '../../src/app';
import Cache from '../../src/lib/Cache';

let userData;

function getCachedDeliveries() {
  const cacheKey = `deliveries`;
  return Cache.get(cacheKey);
}

export default () =>
  describe('Cache', () => {
    beforeEach(async () => {
      await truncate();
    });

    it('should cache data', async () => {
      const user = await factory.attrs('User');

      const signupResponse = await request(app)
        .post('/users')
        .send(user);

      const signinResponse = await request(app)
        .post('/sessions')
        .send({
          email: user.email,
          password: user.password,
        });

      userData = {
        id: signupResponse.body.id,
        name: user.name,
        email: user.email,
        password: user.password,
        authorization: ['authorization', `bearer ${signinResponse.body.token}`],
      };

      const uncached = (
        await request(app)
          .get('/deliveries')
          .set(...userData.authorization)
          .send()
      ).body;

      const cached = await getCachedDeliveries();

      expect(cached).not.toBeNull();
      expect(cached).not.toBeUndefined();
      expect(JSON.stringify(cached)).toBe(JSON.stringify(uncached));
    });
  });
