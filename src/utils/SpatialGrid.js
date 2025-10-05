// Simple spatial grid for efficient collision detection
// Divides space into cells to reduce collision checks from O(n²) to O(n)

export class SpatialGrid {
    constructor(width, height, cellSize = 64) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.cells = [];
        this.clear();
    }

    /**
     * Clear all cells
     */
    clear() {
        this.cells = Array.from({ length: this.rows * this.cols }, () => []);
    }

    /**
     * Get cell index for coordinates
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {number} - Cell index
     */
    getCellIndex(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);

        // Clamp to valid range
        const clampedCol = Math.max(0, Math.min(this.cols - 1, col));
        const clampedRow = Math.max(0, Math.min(this.rows - 1, row));

        return clampedRow * this.cols + clampedCol;
    }

    /**
     * Insert entity into grid
     * @param {Object} entity - Entity with x, y, width, height
     */
    insert(entity) {
        // Calculate which cells this entity overlaps
        const minX = entity.x - entity.width / 2;
        const maxX = entity.x + entity.width / 2;
        const minY = entity.y - entity.height / 2;
        const maxY = entity.y + entity.height / 2;

        const startCol = Math.max(0, Math.floor(minX / this.cellSize));
        const endCol = Math.min(this.cols - 1, Math.floor(maxX / this.cellSize));
        const startRow = Math.max(0, Math.floor(minY / this.cellSize));
        const endRow = Math.min(this.rows - 1, Math.floor(maxY / this.cellSize));

        // Add to all overlapping cells
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const index = row * this.cols + col;
                this.cells[index].push(entity);
            }
        }
    }

    /**
     * Get potential collision candidates for an entity
     * @param {Object} entity - Entity to check
     * @returns {Array} - Entities in same or adjacent cells
     */
    getNearby(entity) {
        const nearby = new Set();

        // Get entity's cell range
        const minX = entity.x - entity.width / 2;
        const maxX = entity.x + entity.width / 2;
        const minY = entity.y - entity.height / 2;
        const maxY = entity.y + entity.height / 2;

        const startCol = Math.max(0, Math.floor(minX / this.cellSize));
        const endCol = Math.min(this.cols - 1, Math.floor(maxX / this.cellSize));
        const startRow = Math.max(0, Math.floor(minY / this.cellSize));
        const endRow = Math.min(this.rows - 1, Math.floor(maxY / this.cellSize));

        // Collect entities from overlapping cells
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const index = row * this.cols + col;
                this.cells[index].forEach(e => nearby.add(e));
            }
        }

        return Array.from(nearby);
    }

    /**
     * Debug: Get grid statistics
     * @returns {Object} - Grid stats
     */
    getStats() {
        const occupied = this.cells.filter(cell => cell.length > 0).length;
        const maxInCell = Math.max(...this.cells.map(cell => cell.length));
        const avgInCell = this.cells.reduce((sum, cell) => sum + cell.length, 0) / this.cells.length;

        return {
            totalCells: this.cells.length,
            occupiedCells: occupied,
            maxEntitiesInCell: maxInCell,
            avgEntitiesPerCell: avgInCell.toFixed(2)
        };
    }
}
