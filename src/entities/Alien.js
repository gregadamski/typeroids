import Phaser from 'phaser';
import { GAME_DEFAULTS } from '../drills/drillConfig.js';

/**
 * An alien that drifts down the screen with a word (or single letter) label.
 * Tracks typing progress and highlights characters as they are typed.
 */
export class Alien extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {string} word - The word (or single character) to display
     * @param {number} speed - Fall speed in px/sec
     * @param {object} config - Drill config (may override GAME_DEFAULTS)
     */
    constructor(scene, x, y, word, speed, config = {}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.word = word;
        this.speed = speed;
        this.alive = true;
        this.typedIndex = 0;
        this.wobbleOffset = Phaser.Math.FloatBetween(0, Math.PI * 2);
        this.wobbleSpeed = Phaser.Math.FloatBetween(1.5, 3);

        // Alien sprite – scale wider for longer words
        this.sprite = scene.add.image(0, 0, 'alien').setOrigin(0.5);
        const widthScale = Math.max(1, 0.6 + word.length * 0.35);
        this.sprite.setScale(widthScale, 1);
        this.add(this.sprite);

        // Per-character text objects for highlight control
        const fontSize = config.alienLetterFontSize || GAME_DEFAULTS.alienLetterFontSize;
        const fontSizePx = parseInt(fontSize, 10) || 18;
        this.charTexts = [];
        const totalWidth = word.length * (fontSizePx * 0.85);
        const startX = -totalWidth / 2 + fontSizePx * 0.42;

        for (let i = 0; i < word.length; i++) {
            const charText = scene.add.text(
                startX + i * (fontSizePx * 0.85),
                1,
                word[i].toUpperCase(),
                {
                    fontFamily: '"Press Start 2P", "Courier New", monospace',
                    fontSize,
                    color: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 3,
                }
            ).setOrigin(0.5);
            this.add(charText);
            this.charTexts.push(charText);
        }

        // Glow pulse
        scene.tweens.add({
            targets: this.sprite,
            scaleX: widthScale * 1.08,
            scaleY: 1.08,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        this.setDepth(5);
    }

    /** The next character the player needs to type. */
    nextChar() {
        if (this.typedIndex >= this.word.length) return null;
        return this.word[this.typedIndex];
    }

    /** Whether the entire word has been typed. */
    isFullyTyped() {
        return this.typedIndex >= this.word.length;
    }

    /**
     * Advance typing progress by one character and highlight it green.
     */
    advanceChar() {
        if (this.typedIndex >= this.word.length) return;
        this.charTexts[this.typedIndex].setColor('#44ff88');
        this.charTexts[this.typedIndex].setStroke('#005500', 3);
        this.typedIndex++;
    }

    /**
     * Flash the alien red and reset all typing progress.
     */
    resetProgress() {
        this.typedIndex = 0;

        // Flash all chars red briefly, then back to white
        for (const ct of this.charTexts) {
            ct.setColor('#ff4444');
            ct.setStroke('#440000', 3);
        }

        // Shake the container
        if (this.scene) {
            this.scene.tweens.add({
                targets: this,
                x: this.x + 6,
                duration: 40,
                yoyo: true,
                repeat: 3,
                onComplete: () => {
                    for (const ct of this.charTexts) {
                        ct.setColor('#ffffff');
                        ct.setStroke('#000000', 3);
                    }
                },
            });
        }
    }

    update(time, delta) {
        if (!this.alive) return;
        const dt = delta / 1000;
        this.y += this.speed * dt;
        // Horizontal wobble
        this.x += Math.sin(time / 1000 * this.wobbleSpeed + this.wobbleOffset) * 0.5;
    }

    /**
     * Destroy the alien with an explosion effect.
     */
    explode() {
        this.alive = false;

        // Particle explosion
        const emitter = this.scene.add.particles(this.x, this.y, 'particle', {
            speed: { min: 60, max: 180 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 400,
            quantity: 16,
            tint: [0x22cc66, 0x44ee88, 0xffdd44, 0xff8800],
            blendMode: Phaser.BlendModes.ADD,
            emitting: false,
        });
        emitter.explode(16);

        // Score text float
        const scoreFloat = this.scene.add.text(this.x, this.y, '+' + (this.scene._comboMultiplier * 100 * this.word.length), {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '12px',
            color: '#ffdd44',
            stroke: '#000000',
            strokeThickness: 2,
        }).setOrigin(0.5).setDepth(20);

        this.scene.tweens.add({
            targets: scoreFloat,
            y: this.y - 40,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => scoreFloat.destroy(),
        });

        // Clean up
        this.scene.time.delayedCall(500, () => emitter.destroy());
        this.destroy();
    }
}
