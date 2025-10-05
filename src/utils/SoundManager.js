// Lightweight sound manager using Web Audio API
export class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        this.volume = 0.3; // Global volume

        // Initialize on user interaction (required by browsers)
        this.initialized = false;
    }

    /**
     * Initialize audio context (must be called after user interaction)
     */
    init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;
            this.generateSounds();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    /**
     * Generate retro-style sound effects using oscillators
     */
    generateSounds() {
        // Sounds are generated procedurally - no audio files needed!
        this.sounds = {
            shoot: () => this.playTone(220, 0.05, 'square'),
            explosion: () => this.playNoise(0.3, 0.5),
            enemyHit: () => this.playTone(150, 0.1, 'sawtooth'),
            playerHit: () => this.playExplosion(),
            levelComplete: () => this.playMelody([262, 330, 392, 523], 0.15)
        };
    }

    /**
     * Play a simple tone
     * @param {number} frequency - Frequency in Hz
     * @param {number} duration - Duration in seconds
     * @param {string} type - Oscillator type
     */
    playTone(frequency, duration, type = 'sine') {
        if (!this.enabled || !this.initialized) return;

        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = type;
        oscillator.frequency.value = frequency;

        // Envelope (fade out)
        gainNode.gain.value = this.volume;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + duration
        );

        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration);
    }

    /**
     * Play white noise (for explosions)
     */
    playNoise(duration, fadeTime) {
        if (!this.enabled || !this.initialized) return;

        const bufferSize = this.audioContext.sampleRate * duration;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        // Generate white noise
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        const filter = this.audioContext.createBiquadFilter();

        source.buffer = buffer;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        // Low-pass filter for smoother explosion
        filter.type = 'lowpass';
        filter.frequency.value = 1000;

        gainNode.gain.value = this.volume;
        gainNode.gain.exponentialRampToValueAtTime(
            0.01,
            this.audioContext.currentTime + fadeTime
        );

        source.start();
        source.stop(this.audioContext.currentTime + duration);
    }

    /**
     * Play explosion sound (combination of noise and tone)
     */
    playExplosion() {
        if (!this.enabled || !this.initialized) return;

        this.playNoise(0.5, 0.3);
        this.playTone(80, 0.3, 'sawtooth');
    }

    /**
     * Play a simple melody
     */
    playMelody(frequencies, noteDuration) {
        if (!this.enabled || !this.initialized) return;

        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, noteDuration, 'square');
            }, i * noteDuration * 1000);
        });
    }

    /**
     * Play a named sound effect
     * @param {string} soundName - Name of the sound
     */
    play(soundName) {
        if (!this.enabled || !this.initialized) {
            this.init(); // Try to initialize
        }

        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    /**
     * Toggle sound on/off
     */
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    /**
     * Set volume (0-1)
     */
    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}
