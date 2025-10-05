// Base Component class - All components extend this
export class Component {
    constructor(entity) {
        this.entity = entity;
        this.enabled = true;
    }

    /**
     * Called once when component is added to entity
     */
    init() {}

    /**
     * Called every frame
     * @param {number} deltaTime - Time since last frame in seconds
     * @param {Object} context - Game context (inputManager, etc.)
     */
    update(deltaTime, context) {}

    /**
     * Called when component is destroyed
     */
    destroy() {}
}
