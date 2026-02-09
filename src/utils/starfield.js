import Phaser from 'phaser';

/**
 * Creates a multi-layer scrolling starfield background.
 * Call createStarfield() in create(), and updateStarfield() in update().
 */

const STAR_LAYERS = [
    { count: 60, speedY: 15, size: 1, alpha: 0.4 },
    { count: 40, speedY: 30, size: 1.5, alpha: 0.6 },
    { count: 20, speedY: 55, size: 2, alpha: 0.9 },
];

export function createStarfield(scene) {
    scene._starLayers = STAR_LAYERS.map((layer) => {
        const stars = [];
        for (let i = 0; i < layer.count; i++) {
            const x = Phaser.Math.Between(0, 800);
            const y = Phaser.Math.Between(0, 600);
            const star = scene.add
                .circle(x, y, layer.size, 0xffffff, layer.alpha)
                .setDepth(0);
            stars.push(star);
        }
        return { stars, speedY: layer.speedY };
    });
}

export function updateStarfield(scene, delta) {
    if (!scene._starLayers) return;
    const dt = delta / 1000;
    for (const layer of scene._starLayers) {
        for (const star of layer.stars) {
            star.y += layer.speedY * dt;
            if (star.y > 610) {
                star.y = -5;
                star.x = Phaser.Math.Between(0, 800);
            }
        }
    }
}
