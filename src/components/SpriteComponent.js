import { Component } from './Component.js';

// Sprite Component - Handles rendering
export class SpriteComponent extends Component {
    constructor(entity, color = '#fff', shape = 'rect') {
        super(entity);
        this.color = color;
        this.shape = shape; // 'rect', 'circle', 'triangle'
        this.opacity = 1.0;
    }

    /**
     * Render the sprite
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    render(ctx) {
        if (!this.enabled) return;

        const transform = this.entity.getComponent('TransformComponent');
        if (!transform) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;

        switch (this.shape) {
            case 'circle':
                ctx.beginPath();
                ctx.arc(transform.x, transform.y, transform.width / 2, 0, Math.PI * 2);
                ctx.fill();
                break;

            case 'triangle':
                ctx.beginPath();
                ctx.moveTo(transform.x, transform.y - transform.height / 2);
                ctx.lineTo(transform.x - transform.width / 2, transform.y + transform.height / 2);
                ctx.lineTo(transform.x + transform.width / 2, transform.y + transform.height / 2);
                ctx.closePath();
                ctx.fill();
                break;

            case 'rect':
            default:
                ctx.fillRect(
                    transform.x - transform.width / 2,
                    transform.y - transform.height / 2,
                    transform.width,
                    transform.height
                );
                break;
        }

        ctx.restore();
    }
}
