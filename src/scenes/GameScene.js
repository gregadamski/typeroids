import Phaser from 'phaser';
import { createStarfield, updateStarfield } from '../utils/starfield.js';
import { StatsTracker } from '../utils/stats.js';
import { Cannon } from '../entities/Cannon.js';
import { Alien } from '../entities/Alien.js';
import { Missile } from '../entities/Missile.js';

/**
 * Core gameplay scene.
 */
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    init(data) {
        this.drill = data.drill;
    }

    create() {
        // ─── State ───
        this.aliens = [];
        this.lives = 3;
        this.score = 0;
        this._comboMultiplier = 1;
        this._comboCount = 0;
        this._aliensSpawned = 0;
        this._drillComplete = false;
        this._paused = false;
        this.stats = new StatsTracker();
        this.stats.totalAliens = this.drill.alienCount;

        // ─── Background ───
        createStarfield(this);

        // ─── Cannon ───
        this.cannon = new Cannon(this, 400, 580);

        // ─── HUD ───
        this._createHUD();

        // ─── Spawn timer (dynamic) ───
        this._spawnTimerEvent = null;
        this._scheduleNextSpawn();

        // ─── Keyboard input ───
        this.input.keyboard.on('keydown', this._onKeyDown, this);

        // ─── Start stats ───
        this.stats.start();

        // ─── Pause overlay (hidden) ───
        this._createPauseOverlay();

        // Camera fade in
        this.cameras.main.fadeIn(300);
    }

    // ─── HUD ───────────────────────────────────────────────────────

    _createHUD() {
        // Score
        this.scoreText = this.add.text(16, 12, 'SCORE: 0', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '14px',
            color: '#ffffff',
        }).setDepth(50);

        // Combo
        this.comboText = this.add.text(16, 34, '', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '11px',
            color: '#ffdd44',
        }).setDepth(50);

        // Drill name
        this.add.text(400, 12, this.drill.name, {
            fontFamily: '"Courier New", monospace',
            fontSize: '12px',
            color: '#667788',
        }).setOrigin(0.5, 0).setDepth(50);

        // Lives
        this.heartIcons = [];
        for (let i = 0; i < 3; i++) {
            const heart = this.add.image(760 - i * 30, 20, 'heart')
                .setScale(0.9)
                .setDepth(50);
            this.heartIcons.push(heart);
        }

        // Progress bar background
        this.add.rectangle(400, 590, 780, 6, 0x111133, 0.5).setDepth(50);
        this.progressBar = this.add.rectangle(10, 590, 0, 4, 0x44aaff, 0.8)
            .setOrigin(0, 0.5)
            .setDepth(50);
    }

    _updateHUD() {
        this.scoreText.setText('SCORE: ' + this.score);

        if (this._comboCount >= 2) {
            this.comboText.setText('COMBO x' + this._comboMultiplier);
            this.comboText.setVisible(true);
        } else {
            this.comboText.setVisible(false);
        }

        // Progress bar
        const progress = (this._aliensSpawned) / this.drill.alienCount;
        this.progressBar.width = 780 * progress;
    }

    // ─── Pause ─────────────────────────────────────────────────────

    _createPauseOverlay() {
        this.pauseOverlay = this.add.container(0, 0).setDepth(100).setVisible(false);

        const bg = this.add.rectangle(400, 300, 800, 600, 0x000000, 0.7);
        const text = this.add.text(400, 280, 'PAUSED', {
            fontFamily: '"Press Start 2P", "Courier New", monospace',
            fontSize: '36px',
            color: '#44aaff',
        }).setOrigin(0.5);
        const hint = this.add.text(400, 330, 'Press ESC to resume', {
            fontFamily: '"Courier New", monospace',
            fontSize: '14px',
            color: '#667788',
        }).setOrigin(0.5);

        this.pauseOverlay.add([bg, text, hint]);
    }

    _togglePause() {
        this._paused = !this._paused;
        this.pauseOverlay.setVisible(this._paused);

        if (this._paused) {
            if (this._spawnTimerEvent) this._spawnTimerEvent.paused = true;
            this.tweens.pauseAll();
        } else {
            if (this._spawnTimerEvent) this._spawnTimerEvent.paused = false;
            this.tweens.resumeAll();
        }
    }

    // ─── Spawning ──────────────────────────────────────────────────

    /** Compute the current spawn interval based on drill progress. */
    _getCurrentSpawnInterval() {
        const progress = this._aliensSpawned / this.drill.alienCount;
        const { start, end } = this.drill.difficulty.spawnInterval;
        return start + (end - start) * progress;
    }

    /** Schedule the next alien spawn with a dynamic delay. */
    _scheduleNextSpawn() {
        if (this._aliensSpawned >= this.drill.alienCount || this._drillComplete) return;

        const delay = this._getCurrentSpawnInterval();
        this._spawnTimerEvent = this.time.delayedCall(delay, () => {
            this._spawnAlien();
            this._scheduleNextSpawn();
        });
    }

    _spawnAlien() {
        if (this._drillComplete) return;

        const keys = this.drill.keys;
        const letter = keys[Phaser.Math.Between(0, keys.length - 1)];
        const x = Phaser.Math.Between(60, 740);
        const y = -30;

        // Speed ramp from difficulty config
        const progress = this._aliensSpawned / this.drill.alienCount;
        const { start, end } = this.drill.difficulty.alienSpeed;
        const speed = start + (end - start) * progress;

        const alien = new Alien(this, x, y, letter, speed, this.drill);
        this.aliens.push(alien);
        this._aliensSpawned++;
    }

    // ─── Input ─────────────────────────────────────────────────────

    _onKeyDown(event) {
        if (event.key === 'Escape') {
            this._togglePause();
            return;
        }

        if (this._paused || this._drillComplete) return;

        const key = event.key.toLowerCase();

        // Find the lowest (closest to bottom) alive alien with this letter
        let target = null;
        let maxY = -Infinity;
        for (const alien of this.aliens) {
            if (alien.alive && alien.letter === key && alien.y > maxY) {
                target = alien;
                maxY = alien.y;
            }
        }

        if (target) {
            // Hit!
            this.cannon.aimAt(target.x, target.y);
            this.cannon.fire();

            // Play shoot sound
            this._playSound('shoot');

            // Launch missile
            new Missile(this, this.cannon.x, this.cannon.y - 30, target, () => {
                if (!target.alive) return;
                target.explode();
                this._playSound('explode');

                // Scoring
                this._comboCount++;
                this._comboMultiplier = Math.min(5, 1 + Math.floor(this._comboCount / 3));
                this.score += 100 * this._comboMultiplier;
                this.stats.recordHit();
                this._updateHUD();
                this._checkDrillComplete();
            });
        } else {
            // Miss (only if key is in drill keys — don't penalize for unrelated keys)
            if (this.drill.keys.includes(key)) {
                this._comboCount = 0;
                this._comboMultiplier = 1;
                this.stats.recordMiss();
                this._updateHUD();
            }
        }
    }

    // ─── Alien escaped ─────────────────────────────────────────────

    _onAlienEscaped(alien) {
        if (!alien.alive) return;
        alien.alive = false;
        alien.destroy();

        this.lives--;
        this.stats.recordEscape();
        this._comboCount = 0;
        this._comboMultiplier = 1;

        // Flash the lost heart
        if (this.heartIcons[this.lives]) {
            this.heartIcons[this.lives].setAlpha(0.2);
        }

        // Camera shake
        this.cameras.main.shake(250, 0.01);

        // Red flash
        this.cameras.main.flash(200, 255, 50, 50, false);

        this._playSound('life-lost');
        this._updateHUD();

        if (this.lives <= 0) {
            this._endGame(false);
        } else {
            this._checkDrillComplete();
        }
    }

    // ─── Drill completion ──────────────────────────────────────────

    _checkDrillComplete() {
        if (this._drillComplete) return;

        // All aliens spawned and none alive on screen
        if (this._aliensSpawned >= this.drill.alienCount) {
            const aliveCount = this.aliens.filter(a => a.alive).length;
            if (aliveCount === 0) {
                this._endGame(true);
            }
        }
    }

    _endGame(completed) {
        if (this._drillComplete) return;
        this._drillComplete = true;
        this.stats.stop();

        // Stop spawning
        if (this._spawnTimerEvent) this._spawnTimerEvent.remove();
        this.input.keyboard.off('keydown', this._onKeyDown, this);

        if (completed) {
            this._playSound('level-complete');
        }

        // Short delay then show results
        this.time.delayedCall(completed ? 800 : 500, () => {
            this.cameras.main.fade(400, 0, 0, 0, false, (cam, progress) => {
                if (progress >= 1) {
                    this.scene.start('GameOverScene', {
                        drill: this.drill,
                        score: this.score,
                        stats: {
                            accuracy: this.stats.getAccuracy(),
                            wpm: this.stats.getWPM(),
                            hits: this.stats.hits,
                            misses: this.stats.misses,
                            escaped: this.stats.aliensEscaped,
                            totalAliens: this.stats.totalAliens,
                            elapsed: this.stats.getElapsedSeconds(),
                            stars: this.stats.getStarRating(this.drill.starThresholds),
                        },
                        completed,
                    });
                }
            });
        });
    }

    // ─── Sound helper ──────────────────────────────────────────────

    _playSound(key) {
        try {
            if (this.cache.audio.has(key)) {
                const audioCtx = this.sound.context;
                const buffer = this.cache.audio.get(key);
                // Handle both raw buffers and Phaser audio cache entries
                const audioBuffer = buffer.buffer || buffer;
                if (audioBuffer instanceof AudioBuffer) {
                    const source = audioCtx.createBufferSource();
                    source.buffer = audioBuffer;
                    const gainNode = audioCtx.createGain();
                    gainNode.gain.value = 0.5;
                    source.connect(gainNode);
                    gainNode.connect(audioCtx.destination);
                    source.start();
                }
            }
        } catch (e) {
            // Audio not available, silently ignore
        }
    }

    // ─── Update loop ───────────────────────────────────────────────

    update(time, delta) {
        if (this._paused) return;

        updateStarfield(this, delta);

        // Update aliens & check for escapes
        for (let i = this.aliens.length - 1; i >= 0; i--) {
            const alien = this.aliens[i];
            if (!alien.alive) {
                this.aliens.splice(i, 1);
                continue;
            }
            alien.update(time, delta);

            // Check if alien escaped past bottom
            if (alien.y > 620) {
                this._onAlienEscaped(alien);
                this.aliens.splice(i, 1);
            }
        }
    }
}
