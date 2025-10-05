import { Component } from './Component.js';

// Animation Component - Handles sprite animations
export class AnimationComponent extends Component {
    constructor(entity) {
        super(entity);
        this.animations = new Map();
        this.currentAnimation = null;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }

    /**
     * Add an animation
     * @param {string} name - Animation name
     * @param {Array} frames - Array of frame data {duration, color, scale, etc.}
     * @param {boolean} loop - Should animation loop
     */
    addAnimation(name, frames, loop = false) {
        this.animations.set(name, { frames, loop, currentFrame: 0 });
    }

    /**
     * Play an animation
     */
    play(name) {
        if (this.animations.has(name)) {
            this.currentAnimation = name;
            this.currentFrame = 0;
            this.frameTimer = 0;
        }
    }

    update(deltaTime, context) {
        if (!this.enabled || !this.currentAnimation) return;

        const anim = this.animations.get(this.currentAnimation);
        if (!anim || anim.frames.length === 0) return;

        this.frameTimer += deltaTime;

        const currentFrameData = anim.frames[this.currentFrame];
        if (this.frameTimer >= currentFrameData.duration) {
            this.frameTimer = 0;
            this.currentFrame++;

            // Check if animation finished
            if (this.currentFrame >= anim.frames.length) {
                if (anim.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentAnimation = null;
                    return;
                }
            }
        }

        // Apply frame effects to sprite component
        const sprite = this.entity.getComponent('SpriteComponent');
        if (sprite && currentFrameData) {
            if (currentFrameData.color) sprite.color = currentFrameData.color;
            if (currentFrameData.opacity !== undefined) sprite.opacity = currentFrameData.opacity;
        }
    }

    /**
     * Check if animation is playing
     */
    isPlaying() {
        return this.currentAnimation !== null;
    }
}
