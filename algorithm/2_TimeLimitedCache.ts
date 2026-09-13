/*
    题目：有时间限制的缓存
        编写一个类，它允许获取和设置键-值对，并且每个键都有一个过期时间 。
            该类有三个公共方法：
            1. set(key, value, duration)：接收参数为整型键key 、整型值value和以毫秒为单位的持续时间duration。
        一旦duration到期后，这个键就无法访问。如果相同的未过期键已经存在，该方法将返回true，否则返回false。
        如果该键已经存在，则它的值和持续时间都应该被覆盖。

            2. get(key)：如果存在一个未过期的键，它应该返回这个键相关的值。否则返回 -1 。

            3. count()：返回未过期键的总数。
 */

// ################# 实现1 #################
var TimeLimitedCache1 = function () {
    this.cache = new Map()
    this.limit = (time, fn) => {
        return setTimeout(fn, time)
    }
};

/** 
 * @param {number} key
 * @param {number} value
 * @param {number} duration time until expiration in ms
 * @return {boolean} if un-expired key already existed
 * 平均时间复杂度O(logn)
 */
TimeLimitedCache1.prototype.set = function (key, value, duration) {
    if (key < 0) return false
    if (duration < 0 || duration > 1000) return false
    if (this.cache.has(key)) {
        this.cache.get(key).value = value
        clearTimeout(this.cache.get(key).duration)
        this.cache.get(key).duration = this.limit(duration, () => this.cache.delete(key))
        return true
    } else {
        this.cache.set(key, {
            value,
            duration: this.limit(duration, () => this.cache.delete(key))
        })
        return false
    }
};

/** 
 * @param {number} key
 * @return {number} value associated with key
 * 平均时间复杂度O(1)
 */
TimeLimitedCache1.prototype.get = function (key) {
    if (!this.cache.has(key)) return -1
    return this.cache.get(key).value
};

/** 
 * @return {number} count of non-expired keys
 * 平均时间复杂度O(1)
 */
TimeLimitedCache1.prototype.count = function () {
    return this.cache.size
};


// ################# 实现2 #################

var TimeLimitedCache2 = function () {
    this.cache = new Map()
};

/** 
 * @param {number} key
 * @param {number} value
 * @param {number} duration time until expiration in ms
 * @return {boolean} if un-expired key already existed
 * 平均时间复杂度O(1)
 */
TimeLimitedCache2.prototype.set = function (key, value, duration) {
    let now = Date.now()
    let bool = false
    if (this.cache.has(key)) bool = (now < this.cache.get(key).duration)
    this.cache.set(key, {
        value,
        duration: duration + now
    })
    return bool
};

/** 
 * @param {number} key
 * @return {number} value associated with key
 * 平均时间复杂度O(1)
 */
TimeLimitedCache2.prototype.get = function (key) {
    let now = Date.now()
    if (!this.cache.has(key)) return -1
    if (now < this.cache.get(key).duration) {
        return this.cache.get(key).value
    } else {
        this.cache.delete(key)
        return -1
    }
};

/** 
 * @return {number} count of non-expired keys
 * 平均时间复杂度O(n)
 */
TimeLimitedCache2.prototype.count = function () {
    let now = Date.now()
    for (const [key, item] of this.cache) {
        if (now > item.duration) this.cache.delete(key)
    }
    return this.cache.size
};