class CacheService {
  constructor() {
    this.cache = new Map()

    this.stats = {
      hits: 0,    // Got from Cache
      misses: 0,  // Not in cache
      sets: 0,    // Store in cache
    }
  }

  // ─── STORE IN CACHE ────────────────────────────
  async set(key, value, ttlSeconds = 300) {
    if (this.cache.has(key)) {
      clearTimeout(this.cache.get(key).timer)
    }

    const timer = setTimeout(() => {
      this.cache.delete(key)
      console.log(`🗑️  Cache expired: ${key}`)
    }, ttlSeconds * 1000)

    timer.unref()

    this.cache.set(key, {
      value,
      expiresAt: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
      timer,
      cachedAt: new Date().toISOString(),
    })

    this.stats.sets++
    console.log(`💾 Cache set: ${key} (TTL: ${ttlSeconds}s)`)
  }

  // ─── REMOVE FROM CACHE ────────────────────────────────
  async get(key) {
    const entry = this.cache.get(key)

    if (!entry) {
      this.stats.misses++
      return null // Cache miss
    }

    this.stats.hits++
    console.log(`✅ Cache hit: ${key}`)
    return entry.value
  }

  has(key) {
    return this.cache.has(key)
  }

  // ─── DELETE CACHE ──────────────────────────────
  async delete(key) {
    const entry = this.cache.get(key)
    if (entry) {
      clearTimeout(entry.timer)
      this.cache.delete(key)
      console.log(`🗑️  Cache deleted: ${key}`)
      return true
    }
    return false
  }


  async deleteByPrefix(prefix) {
    let count = 0
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        await this.delete(key)
        count++
      }
    }
    console.log(`🗑️  Deleted ${count} cache entries with prefix: ${prefix}`)
    return count
  }

  // ─── CLEAR ALL THE CACHE ─────────────────────────
  async clear() {
    for (const entry of this.cache.values()) {
      clearTimeout(entry.timer)
    }
    this.cache.clear()
    console.log("🗑️  Cache cleared completely")
  }

  // ─── CACHE STATS ────────────────────────────────────
  getStats() {
    const total = this.stats.hits + this.stats.misses
    return {
      totalKeys: this.cache.size,
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: total > 0 ? `${((this.stats.hits / total) * 100).toFixed(1)}%` : "0%",
      sets: this.stats.sets,
      keys: Array.from(this.cache.keys()).map((key) => ({
        key,
        expiresAt: this.cache.get(key).expiresAt,
        cachedAt: this.cache.get(key).cachedAt,
      })),
    }
  }
}

const cacheInstance = new CacheService()

module.exports = cacheInstance