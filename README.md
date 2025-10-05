# Galagon - Retro Space Shooter

A modern, modular space shooter game inspired by classic arcade games like Galaga.

## Features

- 🎮 Auto-fire gameplay - just focus on dodging!
- 📱 Mobile-friendly with touch controls
- ⌨️ Desktop controls with keyboard
- 🌊 Multiple wave patterns (Classic, V-Formation, Diamond)
- 🎯 Progressive difficulty (15% faster each loop)
- 💯 Score and lives system
- 🎨 Animated enemies and explosion effects
- ⚡ Optimized with object pooling for smooth 60 FPS
- 🖥️ High-DPI display support

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
│   │   ├── level1.js      # Classic formation
│   │   ├── level2.js      # V formation
│   │   ├── level3.js      # Diamond formation
│   │   └── levelManager.js # Level progression
│   └── utils/
│       ├── helpers.js     # Utility functions
│       └── ObjectPool.js  # Object pooling for performance
```

## How to Play

1. Open `index.html` in a modern web browser
2. Use arrow keys (or A/D) to move your ship
3. Avoid enemy bullets and shoot down all enemies
4. Clear waves to progress through different formations
5. Try to get the highest score!

## Adding New Content

### Create a New Enemy Type

Edit `src/config/constants.js`:
```javascript
COLORS: {
    ENEMY_TYPE_4: '#0ff',  // Add new color
}

POINTS: {
    ENEMY_TYPE_4: 40  // Add point value
}
```

### Create a New Level

Create `src/levels/level4.js`:
```javascript
import { Level } from './Level.js';

export const level4 = new Level({
    name: 'Wave 4',
    difficulty: 4,
    enemies: [
        { x: 100, y: 50, type: 2 },
        { x: 200, y: 50, type: 2 },
        // ... add more enemies
    ]
});
```

Then add to `src/levels/levelManager.js`:
```javascript
import { level4 } from './level4.js';

this.levels = [level1, level2, level3, level4];
```

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
