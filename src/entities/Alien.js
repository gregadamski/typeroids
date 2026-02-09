import Phaser from 'phaser';
import { GAME_DEFAULTS } from '../drills/drillConfig.js';

/**
 * An alien that drifts down the screen with a letter label.
 */
export class Alien extends Phaser.GameObjects.Container {
    constructor(scene, x, y, letter, speed, config = {}) {
        super(scene, x, y);
        scene.add.existing(this);

        this.letter = letter;
        this.speed = speed;
        this.alive = true;
        this.wobbleOffset = Phaser.Math.FloatBetween(0, Math.PI * 2);
        this.wobbleSpeed = Phaser.Math.FloatBetween(1.5, 3);

        // Alien sprite
        this.sprite = scene.add.image(0, 0, 'alien').setOrigin(0.5);
        this.add(this.sprite);

        // Letter label
        const fontSize = config.alienLetterFontSize || GAME_DEFAULTS.alienLetterFontSize;
        this.label = scene.add.text(0, 1, letter.toUpperCase(), {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5);
        this.add(this.label);

        // Glow pulse
        scene.tweens.add({
            targets: this.sprite,
            scaleX: 1.08,
            scaleY: 1.08,
            duration: 600,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        this.setDepth(5);
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
        const scoreFloat = this.scene.add.text(this.x, this.y, '+' + (this.scene._comboMultiplier * 100), {
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
