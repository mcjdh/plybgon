# Component System Architecture

The game now uses a **Component-Based Entity System** for maximum flexibility and code reuse.

## Overview

Instead of monolithic entity classes with hardcoded behavior, entities are now composed of reusable components:

```
Entity
├── TransformComponent (position, size, velocity)
├── SpriteComponent (rendering)
├── InputComponent (player input)
├── WeaponComponent (shooting)
├── AnimationComponent (visual effects)
└── ... (easily add more!)
```

## Benefits

✅ **Code Reuse** - Components can be shared across different entity types
✅ **Flexibility** - Add/remove behaviors dynamically at runtime
✅ **Easy Extension** - New features = new components, no entity refactoring
✅ **Separation of Concerns** - Each component handles ONE responsibility
✅ **Maintainability** - Changes to one component don't affect others

## Core Classes

### Component (Base Class)
`src/components/Component.js`

All components extend this base class:

```javascript
class Component {
    constructor(entity) {
        this.entity = entity;
        this.enabled = true;
    }

    init() {}  // Called when added to entity
    update(deltaTime, context) {}  // Called every frame
    destroy() {}  // Called when removed
}
```

### Entity (Component Container)
`src/entities/Entity.js`

Entities manage components:

```javascript
const entity = new Entity(x, y, width, height);

// Add components
entity.addComponent(new TransformComponent(entity, x, y, 32, 32));
entity.addComponent(new SpriteComponent(entity, '#0f0', 'rect'));

// Access components
const transform = entity.getComponent('TransformComponent');
transform.velocityX = 100;

// Update all components
entity.update(deltaTime, context);

// Render via SpriteComponent
entity.draw(ctx);
```

## Available Components

### 1. TransformComponent
**Purpose:** Position, size, velocity, bounds checking
**File:** `src/components/TransformComponent.js`

```javascript
const transform = new TransformComponent(entity, x, y, width, height);
transform.velocityX = 200;  // Move right
transform.velocityY = -100; // Move up

// Auto-updates position based on velocity
transform.update(deltaTime, context);

// Get collision bounds
const bounds = transform.getBounds();
// { left, right, top, bottom, centerX, centerY }

// Check if off-screen
if (transform.isOffScreen(canvasWidth, canvasHeight)) {
    entity.destroy();
}
```

### 2. SpriteComponent
**Purpose:** Visual rendering (color, shape, opacity)
**File:** `src/components/SpriteComponent.js`

```javascript
const sprite = new SpriteComponent(entity, '#ff0', 'triangle');

// Supported shapes: 'rect', 'circle', 'triangle'
sprite.shape = 'circle';
sprite.color = '#f00';
sprite.opacity = 0.5;

// Renders automatically when entity.draw() is called
```

### 3. InputComponent
**Purpose:** Player keyboard/touch controls
**File:** `src/components/InputComponent.js`

```javascript
const input = new InputComponent(entity, speed);

// Automatically handles:
// - Arrow keys / A-D
// - Touch controls
// - Screen boundary clamping

// Context must provide:
// - inputManager
// - canvasWidth
```

### 4. WeaponComponent
**Purpose:** Shooting/fire rate management
**File:** `src/components/WeaponComponent.js`

```javascript
const weapon = new WeaponComponent(entity, fireRate);

// Fire rate = shots per second
// Example: 2 = shoot every 0.5 seconds

if (weapon.canShoot()) {
    const pos = weapon.getBulletSpawnPosition();
    // Spawn bullet at pos.x, pos.y
}
```

### 5. HealthComponent
**Purpose:** HP, damage, invulnerability
**File:** `src/components/HealthComponent.js`

```javascript
const health = new HealthComponent(entity, maxHealth);

// Take damage
if (health.takeDamage(1)) {
    // Entity died
}

// Heal
health.heal(1);

// Temporary invulnerability
health.setInvulnerable(2.0); // 2 seconds

// Check status
if (health.isAlive()) { ... }
```

### 6. AnimationComponent
**Purpose:** Frame-based animations
**File:** `src/components/AnimationComponent.js`

```javascript
const anim = new AnimationComponent(entity);

// Define animation
anim.addAnimation('explode', [
    { duration: 0.1, color: '#ff0', opacity: 1.0 },
    { duration: 0.1, color: '#f80', opacity: 0.8 },
    { duration: 0.1, color: '#f00', opacity: 0.5 }
], false); // loop = false

// Play animation
anim.play('explode');

// Check if playing
if (anim.isPlaying()) { ... }
```

### 7. EnemyMovementComponent
**Purpose:** Enemy group movement behavior
**File:** `src/components/EnemyMovementComponent.js`

```javascript
const movement = new EnemyMovementComponent(entity, speed);

// Automatically applies horizontal movement
// based on context.enemyDirection (1 or -1)

// Respects entity.speedMultiplier for difficulty scaling
```

## Usage Examples

### Creating a New Entity Type

```javascript
import { Entity } from './entities/Entity.js';
import { TransformComponent } from './components/TransformComponent.js';
import { SpriteComponent } from './components/SpriteComponent.js';
import { HealthComponent } from './components/HealthComponent.js';

class Boss extends Entity {
    constructor(x, y) {
        super(x, y, 64, 64);

        // Position & physics
        this.addComponent(new TransformComponent(this, x, y, 64, 64));

        // Rendering
        this.addComponent(new SpriteComponent(this, '#f0f', 'circle'));

        // Health system
        this.addComponent(new HealthComponent(this, 10)); // 10 HP

        // Animation
        const anim = new AnimationComponent(this);
        anim.addAnimation('hit', [
            { duration: 0.05, color: '#fff' },
            { duration: 0.05, color: '#f0f' }
        ], false);
        this.addComponent(anim);
    }

    takeDamage() {
        const health = this.getComponent('HealthComponent');
        const anim = this.getComponent('AnimationComponent');

        if (health.takeDamage(1)) {
            // Died
            return true;
        }

        anim.play('hit');
        return false;
    }
}
```

### Creating a Custom Component

```javascript
import { Component } from './components/Component.js';

class SinewaveMovementComponent extends Component {
    constructor(entity, amplitude, frequency) {
        super(entity);
        this.amplitude = amplitude;
        this.frequency = frequency;
        this.time = 0;
    }

    update(deltaTime, context) {
        if (!this.enabled) return;

        const transform = this.entity.getComponent('TransformComponent');
        if (!transform) return;

        this.time += deltaTime;

        // Apply sine wave to Y position
        const baseY = this.entity.baseY || transform.y;
        transform.y = baseY + Math.sin(this.time * this.frequency) * this.amplitude;
    }
}

// Use it:
const enemy = new Enemy(x, y);
enemy.baseY = y;
enemy.addComponent(new SinewaveMovementComponent(enemy, 20, 2));
```

## Migration from Old System

### Before (Monolithic)
```javascript
class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 32);
        this.speed = 200;
        this.fireTimer = 0;
        this.color = '#0f0';
    }

    update(deltaTime, inputManager) {
        // Movement logic
        if (inputManager.isLeft()) this.x -= this.speed * deltaTime;
        if (inputManager.isRight()) this.x += this.speed * deltaTime;

        // Fire logic
        this.fireTimer += deltaTime;
        if (this.fireTimer > 0.5) {
            // Shoot
            this.fireTimer = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 32, 32);
    }
}
```

### After (Component-Based)
```javascript
class Player extends Entity {
    constructor(x, y) {
        super(x, y, 32, 32);

        this.addComponent(new TransformComponent(this, x, y, 32, 32));
        this.addComponent(new SpriteComponent(this, '#0f0', 'rect'));
        this.addComponent(new InputComponent(this, 200));
        this.addComponent(new WeaponComponent(this, 2)); // 2 shots/sec
    }

    // No update() or draw() needed - handled by components!
}
```

**Code reduction:** ~40 lines → ~8 lines
**Flexibility:** Each behavior can be modified independently
**Reusability:** Same components work for other entities

## Performance Notes

- Component iteration is O(n) where n = number of components per entity (~5-7 typical)
- Components use Maps for O(1) lookup by name
- No performance overhead vs monolithic approach
- **Backward compatible:** Legacy `entity.x`, `entity.y` still work via sync

## Best Practices

1. **One Responsibility** - Each component handles ONE thing
2. **No Inter-Component Dependencies** - Access via `entity.getComponent()`
3. **Context for Shared Data** - Pass game state via `context` parameter
4. **Enable/Disable** - Use `component.enabled = false` instead of removing
5. **Composition over Inheritance** - Build entities by combining components

## Future Extensions

Easy to add:

- **ParticleComponent** - Explosion/trail effects
- **AudioComponent** - Per-entity sound emitters
- **AIComponent** - Pathfinding/state machines
- **PhysicsComponent** - Collision response/gravity
- **NetworkComponent** - Multiplayer sync

Just create the component, extend `Component`, and add it to entities!
