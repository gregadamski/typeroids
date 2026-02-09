import Phaser from 'phaser';
import { createStarfield, updateStarfield } from '../utils/starfield.js';
import { DRILLS } from '../drills/drillConfig.js';

/**
 * Menu scene – title screen and drill selection.
 */
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        createStarfield(this);

        // Title
        this.add.text(400, 60, 'TYPEROIDS', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '42px',
            color: '#44aaff',
            stroke: '#0044aa',
            strokeThickness: 4,
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(400, 105, 'Defend Earth with your typing skills!', {
            fontFamily: '"Courier New", monospace',
            fontSize: '13px',
            color: '#88ccff',
        }).setOrigin(0.5);

        // Glow effect on title
        const titleGlow = this.add.text(400, 60, 'TYPEROIDS', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '42px',
            color: '#88ddff',
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: titleGlow,
            alpha: 0.3,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
        });

        // Drill selection
        this.add.text(400, 155, '━━━ SELECT DRILL ━━━', {
            fontFamily: '"Courier New", monospace',
            fontSize: '14px',
            color: '#666688',
        }).setOrigin(0.5);

        this._selectedIndex = 0;
        this._drillItems = [];

        const startY = 190;
        const itemHeight = 44;

        DRILLS.forEach((drill, index) => {
            const y = startY + index * itemHeight;

            // Background box
            const bg = this.add.rectangle(400, y, 500, 36, 0x112244, 0.6)
                .setStrokeStyle(1, 0x334466)
                .setInteractive({ useHandCursor: true });

            // Drill name
            const nameText = this.add.text(180, y, drill.name, {
                fontFamily: '"Courier New", monospace',
                fontSize: '14px',
                color: '#aabbcc',
            }).setOrigin(0, 0.5);

            // Keys preview
            const keysPreview = drill.keys.slice(0, 8).join(' ').toUpperCase() +
                (drill.keys.length > 8 ? ' ...' : '');
            const keysText = this.add.text(620, y, keysPreview, {
                fontFamily: '"Courier New", monospace',
                fontSize: '10px',
                color: '#667788',
            }).setOrigin(1, 0.5);

            // Hover effects
            bg.on('pointerover', () => {
                this._selectedIndex = index;
                this._updateSelection();
            });

            bg.on('pointerdown', () => {
                this._startDrill(index);
            });

            this._drillItems.push({ bg, nameText, keysText });
        });

        this._updateSelection();

        // Keyboard navigation
        this.input.keyboard.on('keydown-UP', () => {
            this._selectedIndex = Math.max(0, this._selectedIndex - 1);
            this._updateSelection();
        });
        this.input.keyboard.on('keydown-DOWN', () => {
            this._selectedIndex = Math.min(DRILLS.length - 1, this._selectedIndex + 1);
            this._updateSelection();
        });
        this.input.keyboard.on('keydown-ENTER', () => {
            this._startDrill(this._selectedIndex);
        });

        // Footer
        this.add.text(400, 570, '↑↓ Navigate   ENTER Start', {
            fontFamily: '"Courier New", monospace',
            fontSize: '11px',
            color: '#445566',
        }).setOrigin(0.5);
    }

    _updateSelection() {
        this._drillItems.forEach((item, i) => {
            const selected = i === this._selectedIndex;
            item.bg.setFillStyle(selected ? 0x1a3366 : 0x112244, selected ? 0.9 : 0.6);
            item.bg.setStrokeStyle(selected ? 2 : 1, selected ? 0x44aaff : 0x334466);
            item.nameText.setColor(selected ? '#ffffff' : '#aabbcc');
            item.nameText.setFontSize(selected ? '15px' : '14px');
        });
    }

    _startDrill(index) {
        this.cameras.main.fade(300, 0, 0, 0, false, (cam, progress) => {
            if (progress >= 1) {
                this.scene.start('GameScene', { drill: DRILLS[index] });
            }
        });
    }

    update(time, delta) {
        updateStarfield(this, delta);
    }
}
