export function checkCollision(obj1, obj2) {
    const t1 = obj1.getComponent?.('TransformComponent') || obj1;
    const t2 = obj2.getComponent?.('TransformComponent') || obj2;

    const x1 = t1.x, y1 = t1.y, w1 = t1.width, h1 = t1.height;
    const x2 = t2.x, y2 = t2.y, w2 = t2.width, h2 = t2.height;

    return x1 - w1 / 2 < x2 + w2 / 2 &&
           x1 + w1 / 2 > x2 - w2 / 2 &&
           y1 - h1 / 2 < y2 + h2 / 2 &&
           y1 + h1 / 2 > y2 - h2 / 2;
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function lerp(start, end, t) {
    return start + (end - start) * clamp(t, 0, 1);
}

export function distance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

export function inBounds(x, y, minX, maxX, minY, maxY) {
    return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

export function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

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

export function removeWhere(array, predicate) {
    const removed = [];
    for (let i = array.length - 1; i >= 0; i--) {
        if (predicate(array[i])) {
            removed.push(...array.splice(i, 1));
        }
    }
    return removed;
}
