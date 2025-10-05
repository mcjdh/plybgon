# Galagon - Retro Space Shooter

A modern, modular space shooter game inspired by classic arcade games like Galaga.

## Features

- 🎮 Auto-fire gameplay - just focus on dodging!
- 📱 Mobile-friendly with optimized touch controls
- ⌨️ Desktop controls with keyboard
- 🌊 **5 unique wave patterns** (Grid, V, Diamond, Chevron, Circle)
- 🎯 Progressive difficulty (15% faster each loop)
- 💯 Score and lives system
- 🎨 Animated enemies and explosion effects
- 🔊 **Retro sound effects** (procedurally generated, no audio files!)
- ⚡ Optimized with object pooling for smooth 60 FPS
- 🖥️ High-DPI display support
- 📊 **Data-driven level design** (easy to add new formations)

## Controls

### Desktop
- **Arrow Keys** or **A/D**: Move left/right
- **Spacebar**: Restart game (when game over)

### Mobile
- **Touch**: Slide finger to move ship
- Ship auto-fires continuously

## Project Structure

```
galagon-geometry-space-type-game/
├── index.html              # Main HTML file
├── src/
│   ├── main.js            # Entry point
│   ├── config/
│   │   └── constants.js   # Game configuration
│   ├── core/
│   │   ├── Game.js        # Main game loop
│   │   ├── Renderer.js    # Rendering system
│   │   └── InputManager.js # Input handling
│   ├── entities/
│   │   ├── Entity.js      # Base entity class
│   │   ├── Player.js      # Player ship
│   │   ├── Enemy.js       # Enemy ships
│   │   └── Bullet.js      # Projectiles
│   ├── systems/
│   │   ├── CollisionSystem.js  # Collision detection
│   │   ├── SpawnSystem.js      # Bullet/enemy spawning
│   │   └── ScoreSystem.js      # Score management
│   ├── levels/
│   │   ├── Level.js       # Base level class
│   │   ├── levelData.js   # Data-driven level definitions
│   │   └── levelManager.js # Level progression
│   └── utils/
│       ├── helpers.js     # Utility functions
│       ├── ObjectPool.js  # Object pooling for performance
│       └── SoundManager.js # Procedural sound effects
```

## How to Play

1. Open `index.html` in a modern web browser
2. Use arrow keys (or A/D) to move your ship
3. Avoid enemy bullets and shoot down all enemies
4. Clear waves to progress through different formations
5. Try to get the highest score!

## Adding New Content

### Create a New Level (Easy! Just add data)

Edit `src/levels/levelData.js` and add a new entry:
```javascript
{
    name: 'Wave 6 - Spiral',
    difficulty: 6,
    pattern: 'circle', // or create new pattern
    config: {
        centerX: 200,
        centerY: 100,
        radius: 100,
        count: 20,
        typePattern: 'mixed'
    }
}
```

That's it! No code needed - just data. The level system handles the rest.

### Create a Custom Pattern

Add a new generator function in `levelData.js`:
```javascript
function generateSpiral(config) {
    const enemies = [];
    const { centerX, centerY, count } = config;

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 4; // 2 rotations
        const radius = 50 + (i / count) * 80;
        enemies.push({
            x: centerX + Math.cos(angle) * radius,
            y: centerY + Math.sin(angle) * radius,
            type: i % 3
        });
    }

    return enemies;
}
```

Then use `pattern: 'spiral'` in your level data.

### Modify Game Settings

Edit `src/config/constants.js` to adjust:
- Player speed
- Fire rates
- Enemy behavior
- Colors
- Canvas size

## Development

The game uses ES6 modules, so you may need to run it through a local server for some browsers:

```bash
# Python 3
python -m http.server 8000

# Node.js (with http-server)
npx http-server
```

Then open `http://localhost:8000`

## Architecture Benefits

- **Modular**: Each file has a single responsibility
- **Scalable**: Easy to add new levels, enemies, powerups
- **Maintainable**: Clear separation of concerns
- **Testable**: Systems can be tested independently
- **Readable**: Clean, documented code
- **Performant**: Object pooling eliminates garbage collection lag
- **Delta-time based**: Frame-rate independent physics and timers

## License

Free to use and modify!
