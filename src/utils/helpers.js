// Utility helper functions

/**
 * Check if two rectangular objects are colliding
 * Assumes centered coordinates (x, y is center of object)
 * @param {Object} obj1 - First object with x, y, width, height
 * @param {Object} obj2 - Second object with x, y, width, height
 * @returns {boolean} - True if colliding
 */
export function checkCollision(obj1, obj2) {
    return obj1.x - obj1.width / 2 < obj2.x + obj2.width / 2 &&
           obj1.x + obj1.width / 2 > obj2.x - obj2.width / 2 &&
           obj1.y - obj1.height / 2 < obj2.y + obj2.height / 2 &&
           obj1.y + obj1.height / 2 > obj2.y - obj2.height / 2;
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Clamped value
 */
export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

/**
 * Get a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random element from an array
 * @param {Array} array - Array to pick from
 * @returns {*} - Random element
 */
export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Linear interpolation between two values
 * @param {number} start - Start value
 * @param {number} end - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number}
 */
export function lerp(start, end, t) {
    return start + (end - start) * clamp(t, 0, 1);
}

/**
 * Calculate distance between two points
 * @param {number} x1 - First point X
 * @param {number} y1 - First point Y
 * @param {number} x2 - Second point X
 * @param {number} y2 - Second point Y
 * @returns {number} - Distance
 */
export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Check if a point is within bounds
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @param {number} minX - Min X bound
 * @param {number} maxX - Max X bound
 * @param {number} minY - Min Y bound
 * @param {number} maxY - Max Y bound
 * @returns {boolean}
 */
export function inBounds(x, y, minX, maxX, minY, maxY) {
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

/**
 * Map a value from one range to another
 * @param {number} value - Input value
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} - Mapped value
 */
export function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

/**
 * Debounce a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Remove elements from array that match predicate
 * @param {Array} array - Array to filter
 * @param {Function} predicate - Test function
 * @returns {Array} - Removed elements
 */
export function removeWhere(array, predicate) {
    const removed = [];
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) {
            removed.push(...array.splice(i, 1));
        }
    }
    return removed;
}
