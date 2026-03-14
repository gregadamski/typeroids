import Phaser from 'phaser';

/**
 * A missile that flies from the cannon toward a target alien,
 * tracking the alien's live position as it moves.
 */
export class Missile extends Phaser.GameObjects.Container {
    constructor(scene, startX, startY, targetAlien, onHit) {
        super(scene, startX, startY);
        scene.add.existing(this);

        this.targetAlien = targetAlien;
        this.onHit = onHit;
        this._speed = 900; // px/sec – fast but not instant
        this._arrived = false;

        // Missile sprite
        this.sprite = scene.add.image(0, 0, 'missile').setOrigin(0.5, 1);
        this.add(this.sprite);

        // Initial aim rotation
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
    }

    /**
     * Call from scene.update() to move the missile toward the alien each frame.
     */
    track(delta) {
        if (this._arrived) return;

        const target = this.targetAlien;
        if (!target || !target.active) {
            this._impact();
            return;
        }

        const dt = delta / 1000;
        const dx = target.x - this.x;
        const dy = target.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const step = this._speed * dt;

        // Update rotation to track moving target
        const angle = Math.atan2(dy, dx);
        this.sprite.setRotation(angle + Math.PI / 2);

        if (step >= dist) {
            // Arrived
            this.x = target.x;
            this.y = target.y;
            this._impact();
        } else {
            this.x += (dx / dist) * step;
            this.y += (dy / dist) * step;
        }

        this.trail.setPosition(this.x, this.y);
    }

    _impact() {
        if (this._arrived) return;
        this._arrived = true;

        this.trail.stop();
        this.scene.time.delayedCall(300, () => this.trail.destroy());
        if (this.onHit) this.onHit();
        this.destroy();
    }
}
