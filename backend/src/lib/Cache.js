import Redis from 'ioredis';

import redisConfig from '../config/redis';

const keyPrefix = 'cache:';

class Cache {
  constructor() {
    this.redis = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      keyPrefix,
    });
  }

  set(key, value) {
    return this.redis.set(key, JSON.stringify(value), 'EX', 60 * 60 * 24);
  }

  async get(key) {
    const cached = await this.redis.get(key);

    return cached ? JSON.parse(cached) : null;
  }

  invalidate(key) {
    return this.redis.del(key);
  }

  async invalidateRoot(root) {
    const keys = await this.redis.keys(`${keyPrefix}${root}*`);

    if (keys.length <= 0) return 0;

    const keysWithoutPrefix = keys.map(key => key.replace(keyPrefix, ''));

    return this.redis.del(keysWithoutPrefix);
  }

  async invalidatePrefix(prefix) {
    const keys = await this.redis.keys(`${keyPrefix}${prefix}:*`);

    if (keys.length <= 0) return 0;

    const keysWithoutPrefix = keys.map(key => key.replace(keyPrefix, ''));

    return this.redis.del(keysWithoutPrefix);
  }

  async truncate() {
    const allKeys = await this.redis.keys('*');

    if (allKeys.length <= 0) return 0;

    return this.redis.del(allKeys);
  }
}

export default new Cache();
