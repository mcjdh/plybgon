// Centralized entity management system
export class EntityManager {
    constructor() {
        this.entities = [];
        this.entitiesToAdd = [];
        this.entityTypes = {
            PLAYER: 'player',
            BULLET: 'bullet',
            ENEMY: 'enemy',
            ENEMY_BULLET: 'enemyBullet'
        };
    }

    /**
     * Add entity to the manager
     * @param {Entity} entity - Entity to add
     * @param {string} type - Entity type
     */
    add(entity, type) {
        entity.entityType = type;
        this.entitiesToAdd.push(entity);
    }

    /**
     * Process pending additions (called after update to avoid mutation during iteration)
     */
    processPendingAdditions() {
        if (this.entitiesToAdd.length > 0) {
            this.entities.push(...this.entitiesToAdd);
            this.entitiesToAdd = [];
        }
    }

    /**
     * Update all entities
     * @param {number} deltaTime - Time delta
     * @param {Object} context - Additional context (inputManager, enemyDirection, etc.)
     */
    update(deltaTime, context = {}) {
        for (const entity of this.entities) {
            if (!entity.active) continue;

            // Different update logic based on entity type
            if (entity.entityType === this.entityTypes.PLAYER && context.inputManager) {
                entity.update(deltaTime, context.inputManager);
            } else if (entity.entityType === this.entityTypes.ENEMY && context.enemyDirection !== undefined) {
                entity.update(deltaTime, context.enemyDirection);
            } else {
                entity.update(deltaTime);
            }

            // Check if off-screen (for bullets)
            if (entity.isOffScreen && context.canvasWidth && context.canvasHeight) {
                if (entity.isOffScreen(context.canvasWidth, context.canvasHeight)) {
                    entity.destroy();
                }
            }
        }
    }

    /**
     * Get entities by type
     * @param {string} type - Entity type
     * @returns {Array} - Filtered entities
     */
    getByType(type) {
        return this.entities.filter(e => e.active && e.entityType === type);
    }

    /**
     * Get all active entities
     * @returns {Array}
     */
    getActive() {
        return this.entities.filter(e => e.active);
    }

    /**
     * Clean up inactive entities
     * @param {Function} releaseCallback - Optional callback for pooled objects
     */
    cleanup(releaseCallback) {
        // Release pooled objects before removing
        if (releaseCallback) {
            const bullets = this.entities.filter(e =>
                !e.active && (e.entityType === this.entityTypes.BULLET ||
                              e.entityType === this.entityTypes.ENEMY_BULLET)
            );
            releaseCallback(bullets);
        }

        // Remove inactive entities
        this.entities = this.entities.filter(e => e.active);
    }

    /**
     * Get player entity
     * @returns {Entity|null}
     */
    getPlayer() {
        return this.entities.find(e => e.active && e.entityType === this.entityTypes.PLAYER) || null;
    }

    /**
     * Clear all entities
     */
    clear() {
        this.entities = [];
        this.entitiesToAdd = [];
    }

    /**
     * Get entity count by type
     * @param {string} type - Entity type
     * @returns {number}
     */
    countByType(type) {
        return this.entities.filter(e => e.active && e.entityType === type).length;
    }

    /**
     * Execute callback for each entity of type
     * @param {string} type - Entity type
     * @param {Function} callback - Callback function
     */
    forEachOfType(type, callback) {
        this.entities.forEach(entity => {
            if (entity.active && entity.entityType === type) {
                callback(entity);
            }
        });
    }
}
