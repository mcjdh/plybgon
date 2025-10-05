export class InputManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.keys = {};
        this.touchX = null;
        this.onRestart = null;

        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e));
        this.canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e));
    }

    handleKeyDown(e) {
        this.keys[e.key] = true;

        if (e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            if (this.onRestart) {
                this.onRestart();
            }
        }
    }

    handleKeyUp(e) {
        this.keys[e.key] = false;
    }

    handleTouchStart(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        this.touchX = e.touches[0].clientX - rect.left;

        if (this.onRestart) {
            this.onRestart();
        }
    }

    handleTouchMove(e) {
        e.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        this.touchX = e.touches[0].clientX - rect.left;
    }

    handleTouchEnd(e) {
        this.touchX = null;
    }

    isLeft() {
        return this.keys['ArrowLeft'] || this.keys['a'] || this.keys['A'];
    }

    isRight() {
        return this.keys['ArrowRight'] || this.keys['d'] || this.keys['D'];
    }

    getTouchX() {
        return this.touchX;
    }

    reset() {
        this.keys = {};
        this.touchX = null;
    }
}
