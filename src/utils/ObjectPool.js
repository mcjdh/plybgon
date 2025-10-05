// Generic object pool for performance optimization
export class ObjectPool {
    constructor(factory, initialSize = 50) {
        this.factory = factory; // Function to create new objects
        this.pool = [];
        this.active = [];

        // Pre-allocate initial pool
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.factory());
        }
    }

    /**
     * Get an object from the pool
     * @returns {Object} - Pooled object
     */
    acquire(...args) {
        let obj;

        if (this.pool.length > 0) {
            obj = this.pool.pop();
            obj.active = true;
        } else {
            obj = this.factory();
        }

        this.active.push(obj);
        return obj;
    }

    /**
     * Return an object to the pool
     * @param {Object} obj - Object to return
     */
    release(obj) {
        obj.active = false;

        const index = this.active.indexOf(obj);
        if (index !== -1) {
            this.active.splice(index, 1);
            this.pool.push(obj);
        }
    }

    /**
     * Release all inactive objects
     */
    releaseInactive() {
        for (let i = this.active.length - 1; i >= 0; i--) {
            const obj = this.active[i];
            if (!obj.active) {
                this.active.splice(i, 1);
                this.pool.push(obj);
            }
        }
    }

    /**
     * Get all active objects
     * @returns {Array}
     */
    getActive() {
        return this.active;
    }

    /**
     * Clear all objects
     */
    clear() {
        this.pool.push(...this.active);
        this.active = [];
    }

    /**
     * Get pool statistics
     * @returns {Object}
     */
    getStats() {
        return {
            pooled: this.pool.length,
            active: this.active.length,
            total: this.pool.length + this.active.length
        };
    }
}
