import Phaser from 'phaser';
import { createStarfield, updateStarfield } from '../utils/starfield.js';
import { DRILLS } from '../drills/drillConfig.js';
import { t, drillName, getLanguage, setLanguage, LANGUAGES } from '../utils/i18n.js';

/**
 * Menu scene – title screen, language toggle, and drill selection.
 */
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        createStarfield(this);

        // ─── Language toggle (top-right) ───
        const langLabel = getLanguage() === LANGUAGES.PL ? '🇵🇱 PL' : '🇬🇧 EN';
        const langBg = this.add.rectangle(W - 60, 36, 100, 38, 0x112244, 0.8)
            .setStrokeStyle(1, 0x44aaff)
            .setInteractive({ useHandCursor: true })
            .setDepth(60);

        this._langText = this.add.text(W - 60, 36, langLabel, {
            fontFamily: '"Courier New", monospace',
            fontSize: '18px',
            color: '#88ccff',
        }).setOrigin(0.5).setDepth(60);

        langBg.on('pointerover', () => {
            langBg.setFillStyle(0x224488, 1);
            langBg.setStrokeStyle(2, 0x88ddff);
            this._langText.setColor('#ffffff');
        });
        langBg.on('pointerout', () => {
            langBg.setFillStyle(0x112244, 0.8);
            langBg.setStrokeStyle(1, 0x44aaff);
            this._langText.setColor('#88ccff');
        });
        langBg.on('pointerdown', () => {
            const next = getLanguage() === LANGUAGES.EN ? LANGUAGES.PL : LANGUAGES.EN;
            setLanguage(next);
            this.scene.restart();
        });

        // ─── Title ───
        this.add.text(W / 2, H * 0.07, t('menu.title'), {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '64px',
            color: '#44aaff',
            stroke: '#0044aa',
            strokeThickness: 5,
        }).setOrigin(0.5);

        // Subtitle
        this.add.text(W / 2, H * 0.13, t('menu.subtitle'), {
            fontFamily: '"Courier New", monospace',
            fontSize: '20px',
            color: '#88ccff',
        }).setOrigin(0.5);

        // Glow effect on title
        const titleGlow = this.add.text(W / 2, H * 0.07, t('menu.title'), {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '64px',
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

        // ─── Drill selection header ───
        this.add.text(W / 2, H * 0.19, t('menu.selectDrill'), {
            fontFamily: '"Courier New", monospace',
            fontSize: '20px',
            color: '#666688',
        }).setOrigin(0.5);

        this._selectedIndex = 0;
        this._drillItems = [];

        const startY = H * 0.24;
        const itemHeight = 70;

        DRILLS.forEach((drill, index) => {
            const y = startY + index * itemHeight;

            // Background box
            const bg = this.add.rectangle(W / 2, y, W * 0.5, 56, 0x112244, 0.6)
                .setStrokeStyle(1, 0x334466)
                .setInteractive({ useHandCursor: true });

            // Drill name (translated)
            const nameText = this.add.text(W / 2 - W * 0.22, y, drillName(drill.id), {
                fontFamily: '"Courier New", monospace',
                fontSize: '20px',
                color: '#aabbcc',
            }).setOrigin(0, 0.5);

            // Keys preview
            const keysPreview = drill.keys.slice(0, 8).join(' ').toUpperCase() +
                (drill.keys.length > 8 ? ' ...' : '');
            const keysText = this.add.text(W / 2 + W * 0.22, y, keysPreview, {
                fontFamily: '"Courier New", monospace',
                fontSize: '15px',
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
        this.add.text(W / 2, H - 30, t('menu.footer'), {
            fontFamily: '"Courier New", monospace',
            fontSize: '16px',
            color: '#445566',
        }).setOrigin(0.5);
    }

    _updateSelection() {
        this._drillItems.forEach((item, i) => {
            const selected = i === this._selectedIndex;
            item.bg.setFillStyle(selected ? 0x1a3366 : 0x112244, selected ? 0.9 : 0.6);
            item.bg.setStrokeStyle(selected ? 2 : 1, selected ? 0x44aaff : 0x334466);
            item.nameText.setColor(selected ? '#ffffff' : '#aabbcc');
            item.nameText.setFontSize(selected ? '22px' : '20px');
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
