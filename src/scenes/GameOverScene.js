import Phaser from 'phaser';
import { createStarfield, updateStarfield } from '../utils/starfield.js';
import { t, drillName } from '../utils/i18n.js';

/**
 * Game Over / Results scene.
 */
export class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.drill = data.drill;
        this.finalScore = data.score;
        this.stats = data.stats;
        this.completed = data.completed;
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        createStarfield(this);

        // ─── Header ───
        const headerText = this.completed ? t('gameover.complete') : t('gameover.over');
        const headerColor = this.completed ? '#44ff88' : '#ff4444';

        this.add.text(W / 2, H * 0.06, headerText, {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '44px',
            color: headerColor,
            stroke: '#000000',
            strokeThickness: 5,
        }).setOrigin(0.5);

        this.add.text(W / 2, H * 0.12, drillName(this.drill.id), {
            fontFamily: '"Courier New", monospace',
            fontSize: '20px',
            color: '#8899aa',
        }).setOrigin(0.5);

        // ─── Star Rating ───
        const starY = H * 0.18;
        for (let i = 0; i < 3; i++) {
            const tex = i < this.stats.stars ? 'star' : 'star-empty';
            const star = this.add.image(W / 2 - 45 + i * 45, starY, tex)
                .setScale(2.2)
                .setDepth(10);

            if (i < this.stats.stars) {
                // Animate stars in
                star.setScale(0);
                this.tweens.add({
                    targets: star,
                    scale: 2.2,
                    duration: 400,
                    delay: 200 + i * 200,
                    ease: 'Back.easeOut',
                });
            }
        }

        // ─── Score ───
        this.add.text(W / 2, H * 0.26, t('gameover.score'), {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '16px',
            color: '#667788',
        }).setOrigin(0.5);

        const scoreDisplay = this.add.text(W / 2, H * 0.31, '0', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '42px',
            color: '#ffdd44',
        }).setOrigin(0.5);

        // Animate score counting up
        this.tweens.addCounter({
            from: 0,
            to: this.finalScore,
            duration: 1000,
            ease: 'Power2',
            onUpdate: (tween) => {
                scoreDisplay.setText(Math.floor(tween.getValue()).toString());
            },
        });

        // ─── Stats Grid ───
        const statsStartY = H * 0.42;
        const statsData = [
            { label: t('gameover.accuracy'), value: this.stats.accuracy + '%', color: this._getAccuracyColor() },
            { label: t('gameover.wpm'), value: this.stats.wpm.toString(), color: '#88ccff' },
            { label: t('gameover.aliensHit'), value: this.stats.hits + ' / ' + this.stats.totalAliens, color: '#44ff88' },
            { label: t('gameover.missedKeys'), value: this.stats.misses.toString(), color: this.stats.misses > 0 ? '#ff8844' : '#44ff88' },
            { label: t('gameover.escaped'), value: this.stats.escaped.toString(), color: this.stats.escaped > 0 ? '#ff4444' : '#44ff88' },
            { label: t('gameover.time'), value: this.stats.elapsed + 's', color: '#aabbcc' },
        ];

        statsData.forEach((stat, i) => {
            const row = i % 2;
            const col = Math.floor(i / 2);
            const x = W / 2 - 200 + col * 200;
            const y = statsStartY + row * 70;

            this.add.text(x, y, stat.label, {
                fontFamily: '"Courier New", monospace',
                fontSize: '18px',
                color: '#667788',
            }).setOrigin(0.5);

            this.add.text(x, y + 28, stat.value, {
                fontFamily: '"Press Start 2P", "Courier New", monospace',
                fontSize: '20px',
                color: stat.color,
            }).setOrigin(0.5);
        });

        // ─── Buttons ───
        this._createButton(W / 2 - 120, H * 0.72, t('gameover.playAgain'), () => {
            this.cameras.main.fade(300, 0, 0, 0, false, (cam, progress) => {
                if (progress >= 1) {
                    this.scene.start('GameScene', { drill: this.drill });
                }
            });
        });

        this._createButton(W / 2 + 120, H * 0.72, t('gameover.menu'), () => {
            this.cameras.main.fade(300, 0, 0, 0, false, (cam, progress) => {
                if (progress >= 1) {
                    this.scene.start('MenuScene');
                }
            });
        });

        // ─── Fade in ───
        this.cameras.main.fadeIn(400);
    }

    _getAccuracyColor() {
        if (this.stats.accuracy >= 90) return '#44ff88';
        if (this.stats.accuracy >= 70) return '#ffdd44';
        return '#ff8844';
    }

    _createButton(x, y, label, onClick) {
        const bg = this.add.rectangle(x, y, 200, 50, 0x1a3366, 0.9)
            .setStrokeStyle(2, 0x44aaff)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(x, y, label, {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '14px',
            color: '#88ccff',
        }).setOrigin(0.5);

        bg.on('pointerover', () => {
            bg.setFillStyle(0x224488, 1);
            bg.setStrokeStyle(2, 0x88ddff);
            text.setColor('#ffffff');
        });

        bg.on('pointerout', () => {
            bg.setFillStyle(0x1a3366, 0.9);
            bg.setStrokeStyle(2, 0x44aaff);
            text.setColor('#88ccff');
        });

        bg.on('pointerdown', onClick);
    }

    update(time, delta) {
        updateStarfield(this, delta);
    }
}
