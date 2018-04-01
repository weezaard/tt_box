var LRU = require("lru-cache")
  , options = { max: 500
              , length: function (n, key) { return n * 2 + key.length }
              , dispose: function (key, n) { n.close() }
              , maxAge: 1000 * 60 * 60 }
  , assetCache = LRU(options)
  , propertyCache = LRU(options);
  
module.exports.assetCache = assetCache;
module.exports.propertyCache = propertyCache;
/*
console.log(LRU.length);

entityCache.set('a','a1');
entityCache.set('b','b1');

console.log(entityCache.get('b'));
*/