import { createClient } from 'redis';

export const DbSingleton = (function () {
  let instance
  return {
    getInstance: async () => {
      if (instance != null) {
        return instance
      }

      instance = createClient();

      instance.on('error', err => console.log('Redis Client Error', err));

      await instance.connect();

      return instance
    }
  }
})()
