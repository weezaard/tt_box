var LRU = require("lru-cache")
  , options = { max: 500
              , length: function (n, key) { return n * 2 + key.length }
              , dispose: function (key, n) { n.close() }
              , maxAge: 1000 * 60 * 60 }
  , entityCache = LRU(options);
  
module.exports.entityCache = entityCache;
/*
console.log(LRU.length);

entityCache.set('a','a1');
entityCache.set('b','b1');

console.log(entityCache.get('b'));
*/