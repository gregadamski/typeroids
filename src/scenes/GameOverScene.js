import Phaser from 'phaser';
import { createStarfield, updateStarfield } from '../utils/starfield.js';

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
        createStarfield(this);

        // ─── Header ───
        const headerText = this.completed ? 'DRILL COMPLETE!' : 'GAME OVER';
        const headerColor = this.completed ? '#44ff88' : '#ff4444';

        this.add.text(400, 50, headerText, {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '30px',
            color: headerColor,
            stroke: '#000000',
            strokeThickness: 4,
        }).setOrigin(0.5);

        this.add.text(400, 90, this.drill.name, {
            fontFamily: '"Courier New", monospace',
            fontSize: '14px',
            color: '#8899aa',
        }).setOrigin(0.5);

        // ─── Star Rating ───
        const starY = 130;
        for (let i = 0; i < 3; i++) {
            const tex = i < this.stats.stars ? 'star' : 'star-empty';
            const star = this.add.image(355 + i * 45, starY, tex)
                .setScale(1.8)
                .setDepth(10);

            if (i < this.stats.stars) {
                // Animate stars in
                star.setScale(0);
                this.tweens.add({
                    targets: star,
                    scale: 1.8,
                    duration: 400,
                    delay: 200 + i * 200,
                    ease: 'Back.easeOut',
                });
            }
        }

        // ─── Score ───
        this.add.text(400, 190, 'SCORE', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '11px',
            color: '#667788',
        }).setOrigin(0.5);

        const scoreDisplay = this.add.text(400, 220, '0', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '28px',
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
        const statsStartY = 280;
        const statsData = [
            { label: 'Accuracy', value: this.stats.accuracy + '%', color: this._getAccuracyColor() },
            { label: 'WPM', value: this.stats.wpm.toString(), color: '#88ccff' },
            { label: 'Aliens Hit', value: this.stats.hits + ' / ' + this.stats.totalAliens, color: '#44ff88' },
            { label: 'Missed Keys', value: this.stats.misses.toString(), color: this.stats.misses > 0 ? '#ff8844' : '#44ff88' },
            { label: 'Escaped', value: this.stats.escaped.toString(), color: this.stats.escaped > 0 ? '#ff4444' : '#44ff88' },
            { label: 'Time', value: this.stats.elapsed + 's', color: '#aabbcc' },
        ];

        statsData.forEach((stat, i) => {
            const row = i % 2;
            const col = Math.floor(i / 2);
            const x = 200 + col * 200;
            const y = statsStartY + row * 50;

            this.add.text(x, y, stat.label, {
                fontFamily: '"Courier New", monospace',
                fontSize: '12px',
                color: '#667788',
            }).setOrigin(0.5);

            this.add.text(x, y + 20, stat.value, {
                fontFamily: '"Press Start 2P", "Courier New", monospace',
                fontSize: '14px',
                color: stat.color,
            }).setOrigin(0.5);
        });

        // ─── Buttons ───
        this._createButton(300, 440, 'PLAY AGAIN', () => {
            this.cameras.main.fade(300, 0, 0, 0, false, (cam, progress) => {
                if (progress >= 1) {
                    this.scene.start('GameScene', { drill: this.drill });
                }
            });
        });

        this._createButton(500, 440, 'MENU', () => {
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
        const bg = this.add.rectangle(x, y, 160, 40, 0x1a3366, 0.9)
            .setStrokeStyle(2, 0x44aaff)
            .setInteractive({ useHandCursor: true });

        const text = this.add.text(x, y, label, {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '11px',
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
