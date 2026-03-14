import Phaser from 'phaser';

/**
 * The player's cannon at the bottom of the screen.
 */
export class Cannon extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        scene.add.existing(this);

        this.sprite = scene.add.image(0, 0, 'cannon').setOrigin(0.5, 0.8);
        this.sprite.setScale(0.19); // high res scale down
        this.add(this.sprite);

        // Muzzle flash
        this.flash = scene.add.circle(0, -110, 10, 0xffff88, 0)
            .setBlendMode(Phaser.BlendModes.ADD);
        this.add(this.flash);

        this.setDepth(10);
    }

    /**
     * Aim the cannon barrel toward a target point.
     */
    aimAt(targetX, targetY) {
        const angle = Phaser.Math.Angle.Between(this.x, this.y, targetX, targetY);
        // Clamp rotation to avoid weird flips (only aim upward)
        const clampedAngle = Phaser.Math.Clamp(angle, -Math.PI + 0.3, -0.3);
        this.scene.tweens.add({
            targets: this.sprite,
            rotation: clampedAngle + Math.PI / 2,
            duration: 80,
            ease: 'Power2',
        });
    }

    /**
     * Show muzzle flash.
     */
    fire() {
        this.flash.setAlpha(1);
        this.scene.tweens.add({
            targets: this.flash,
            alpha: 0,
            duration: 120,
            ease: 'Power2',
        });
    }
}
