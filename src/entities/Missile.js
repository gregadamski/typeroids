import Phaser from 'phaser';

/**
 * A missile that flies from the cannon to a target alien.
 */
export class Missile extends Phaser.GameObjects.Container {
    constructor(scene, startX, startY, targetAlien, onHit) {
        super(scene, startX, startY);
        scene.add.existing(this);

        this.targetAlien = targetAlien;
        this.onHit = onHit;

        // Missile sprite
        this.sprite = scene.add.image(0, 0, 'missile').setOrigin(0.5, 1);
        this.add(this.sprite);

        // Aim rotation
        const angle = Phaser.Math.Angle.Between(startX, startY, targetAlien.x, targetAlien.y);
        this.sprite.setRotation(angle + Math.PI / 2);

        // Trail emitter
        this.trail = scene.add.particles(startX, startY, 'particle', {
            speed: { min: 5, max: 20 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 200,
            frequency: 15,
            tint: [0xffdd44, 0xff8800],
            blendMode: Phaser.BlendModes.ADD,
        });

        this.setDepth(8);

        // Tween to target
        const distance = Phaser.Math.Distance.Between(startX, startY, targetAlien.x, targetAlien.y);
        const duration = Math.max(80, distance * 0.6); // faster for closer aliens

        scene.tweens.add({
            targets: this,
            x: targetAlien.x,
            y: targetAlien.y,
            duration,
            ease: 'Power1',
            onUpdate: () => {
                this.trail.setPosition(this.x, this.y);
            },
            onComplete: () => {
                this.trail.stop();
                scene.time.delayedCall(300, () => this.trail.destroy());
                if (this.onHit) this.onHit();
                this.destroy();
            },
        });
    }
}
