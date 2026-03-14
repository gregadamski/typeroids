import Phaser from 'phaser';

/**
 * Creates a multi-layer scrolling starfield background.
 * Call createStarfield() in create(), and updateStarfield() in update().
 */

const STAR_LAYERS = [
    { count: 140, speedY: 15, size: 1, alpha: 0.4 },
    { count: 90, speedY: 30, size: 1.5, alpha: 0.6 },
    { count: 50, speedY: 55, size: 2, alpha: 0.9 },
];

export function createStarfield(scene) {
    const W = scene.scale.width;
    const H = scene.scale.height;
    scene._starLayers = STAR_LAYERS.map((layer) => {
        const stars = [];
        for (let i = 0; i < layer.count; i++) {
            const x = Phaser.Math.Between(0, W);
            const y = Phaser.Math.Between(0, H);
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
    const W = scene.scale.width;
    const H = scene.scale.height;
    const dt = delta / 1000;
    for (const layer of scene._starLayers) {
        for (const star of layer.stars) {
            star.y += layer.speedY * dt;
            if (star.y > H + 10) {
                star.y = -5;
                star.x = Phaser.Math.Between(0, W);
            }
        }
    }
}
