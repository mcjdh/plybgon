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
