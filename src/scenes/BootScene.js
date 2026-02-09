import Phaser from 'phaser';
import { generateTextures, generateSounds } from '../utils/assetGenerator.js';

/**
 * Boot scene – generates all assets, then transitions to Menu.
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    create() {
        // Loading text
        const loadingText = this.add.text(400, 280, 'LOADING...', {
            fontFamily: '"Courier New", monospace',
            fontSize: '20px',
            color: '#44aaff',
        }).setOrigin(0.5);

        // Generate all textures
        generateTextures(this);

        // Generate sounds (wrapped in try-catch for browsers that block audio before interaction)
        try {
            generateSounds(this);
        } catch (e) {
            console.warn('Audio generation deferred until user interaction');
        }

        // Short delay to show loading, then go to menu
        this.time.delayedCall(400, () => {
            this.scene.start('MenuScene');
        });
    }
}
